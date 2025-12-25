
import { ReconReport, RiskLevel, ConfidenceLevel, ReconFinding, Subdomain, RiskDimensions } from '../types';

const RESTRICTED_PORTS = [1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 137, 138, 139, 143, 161, 179, 389, 427, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 548, 554, 556, 563, 587, 601, 631, 636, 991, 993, 995, 1025, 1719, 1720, 1723, 2049, 3389, 3659, 4045, 5060, 5061, 6000, 6566, 6665, 6666, 6667, 6668, 6669, 6697, 10080];

const cleanValue = (val: string) => val.replace(/^"|"$/g, '').trim();

const probePort = async (host: string, port: number): Promise<boolean> => {
  if (RESTRICTED_PORTS.includes(port)) return false;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  try {
    await fetch(`https://${host}:${port}`, { 
      mode: 'no-cors', 
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    return true;
  } catch (e: any) {
    clearTimeout(timeoutId);
    return e.name !== 'AbortError' && !e.message?.toLowerCase().includes('timeout') && !e.message?.toLowerCase().includes('restricted');
  }
};

export const performLocalRecon = async (domain: string): Promise<ReconReport> => {
  const dnsRecords: { type: string; value: string }[] = [];
  const findings: ReconFinding[] = [];
  const subdomains: Subdomain[] = [];
  const techStack = new Set<string>(['DNS', 'Web Server']);
  
  const dimensions: RiskDimensions = {
    initialAccess: 0,
    lateralMovement: 0,
    dataExposure: 0,
    brandReputation: 0
  };

  try {
    // 1. Passive Subdomain Discovery
    let discoveredNames = new Set<string>([domain]);
    try {
      const crtResp = await fetch(`https://crt.sh/?q=${domain}&output=json`);
      if (crtResp.ok) {
        const certs = await crtResp.json();
        certs.slice(0, 10).forEach((c: any) => {
          const name = c.name_value.toLowerCase().replace('*.', '');
          if (name.endsWith(domain)) discoveredNames.add(name);
        });
      }
    } catch (e) {
      ['www', 'api', 'dev', 'mail'].forEach(sub => discoveredNames.add(`${sub}.${domain}`));
    }

    // 2. Asset Analysis
    const scanPromises = Array.from(discoveredNames).map(async (host) => {
      try {
        const aResp = await fetch(`https://cloudflare-dns.com/dns-query?name=${host}&type=A`, {
          headers: { accept: 'application/dns-json' }
        });
        const aData = await aResp.json();
        
        if (aData.Answer) {
          const ip = cleanValue(aData.Answer[0].data);
          const openPorts: number[] = [];
          const webPorts = [80, 443, 8080];
          
          for (const port of webPorts) {
            if (await probePort(host, port)) openPorts.push(port);
          }

          subdomains.push({
            name: host,
            ip: ip,
            category: host.includes('api') ? 'cloud' : host.includes('dev') ? 'dev' : 'saas',
            ports: openPorts,
            tags: ['Live Asset'],
            provider: 'Public Cloud'
          });

          // Only add to initialAccess if we actually find an exposed web service
          if (openPorts.length > 0) {
            // We create an "Informational" finding so the user knows why the score moved
            const hasInfoFinding = findings.some(f => f.id === 'L-INFO-WEB');
            if (!hasInfoFinding) {
              findings.push({
                id: 'L-INFO-WEB',
                module: 'Services',
                category: 'inventory',
                title: 'Public Web Services Discovered',
                description: 'Active web services were detected on one or more discovered subdomains. While not a direct vulnerability, every public endpoint increases the available attack surface for manual fingerprinting and automated scanning.',
                severity: RiskLevel.LOW,
                confidence: ConfidenceLevel.HIGH,
                affectedAsset: 'Global',
                evidence: 'Successful HTTP/S handshakes on ports 80/443.',
                impact: 'Incremental increase in attack surface footprint.',
                recommendation: 'Ensure all public endpoints are protected by a WAF and monitor for unexpected service changes.',
                threatActorContext: 'Reconnaissance phase: Attackers map all reachable web servers to identify software versions and potential entry points.',
                compliance: [{ framework: 'CIS', control: '12.4', description: 'Inventory of Network Services' }]
              });
              dimensions.initialAccess += 5;
            }
          }

          if (host.includes('dev') || host.includes('staging') || host.includes('test')) {
            findings.push({
              id: `L-DEV-${host}`,
              module: 'Infrastructure',
              category: 'dev',
              title: `Exposed Environment: ${host}`,
              description: `A development or staging environment (${host}) was identified. These environments often lack production-grade security controls.`,
              severity: RiskLevel.MEDIUM,
              confidence: ConfidenceLevel.HIGH,
              affectedAsset: host,
              evidence: `Successful resolution of development-pattern host.`,
              impact: 'Pre-production fingerprinting.',
              recommendation: 'Move dev/staging behind a VPN.',
              threatActorContext: 'Attackers target dev subdomains for unauthenticated tools.',
              compliance: [{ framework: 'CIS', control: '12.1', description: 'Inventory Assets' }]
            });
            dimensions.dataExposure += 15;
            dimensions.initialAccess += 10;
          }
        }
      } catch (e) {}
    });

    await Promise.all(scanPromises);

    // 3. Email Security Checks
    const txtResp = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`, {
      headers: { accept: 'application/dns-json' }
    });
    const txtData = await txtResp.json();
    const txtRecords = txtData.Answer ? txtData.Answer.map((a: any) => cleanValue(a.data)) : [];
    
    const spf = txtRecords.find(v => v.toLowerCase().startsWith('v=spf1'));
    if (!spf) {
      findings.push({
        id: 'L-EMAIL-SPF',
        module: 'Email Security',
        category: 'exposure',
        title: 'Missing SPF Record',
        description: 'No SPF record found, allowing anyone to spoof mail from this domain.',
        severity: RiskLevel.HIGH,
        confidence: ConfidenceLevel.HIGH,
        affectedAsset: domain,
        evidence: 'No v=spf1 TXT record found.',
        impact: 'High risk of phishing.',
        recommendation: 'Publish an SPF record.',
        threatActorContext: 'Phishers target domains without SPF for high deliverability.',
        compliance: [{ framework: 'CIS', control: '9.2', description: 'Anti-Phishing' }]
      });
      dimensions.brandReputation += 30;
      dimensions.initialAccess += 15;
    }

    // 4. Asset Density Finding (Lateral Movement)
    if (subdomains.length > 5) {
      findings.push({
        id: 'L-INFO-DENSITY',
        module: 'Infrastructure',
        category: 'inventory',
        title: 'High Asset Density Detected',
        description: `Over 5 unique subdomains were identified via passive CT logs. A high density of public assets increases the probability of finding a weak link for lateral movement into the corporate network.`,
        severity: RiskLevel.LOW,
        confidence: ConfidenceLevel.HIGH,
        affectedAsset: domain,
        evidence: `Discovered ${subdomains.length} subdomains in single scan cycle.`,
        impact: 'Increased probability of lateral movement paths.',
        recommendation: 'Audit all subdomains to ensure they are still required and correctly configured.',
        threatActorContext: 'Attackers love "sprawl"—the more assets an organization has, the harder it is to secure every single one.',
        compliance: [{ framework: 'CIS', control: '12.1', description: 'Inventory Management' }]
      });
      dimensions.lateralMovement = 20;
    } else if (subdomains.length > 0) {
      dimensions.lateralMovement = 10;
    }

    // 5. Normalization Logic
    // If no findings, force dimensions to zero to avoid UX confusion
    if (findings.length === 0) {
      dimensions.initialAccess = 0;
      dimensions.lateralMovement = 0;
      dimensions.dataExposure = 0;
      dimensions.brandReputation = 0;
    }

    dimensions.initialAccess = Math.min(dimensions.initialAccess, 100);
    dimensions.lateralMovement = Math.min(dimensions.lateralMovement, 100);
    dimensions.dataExposure = Math.min(dimensions.dataExposure, 100);
    dimensions.brandReputation = Math.min(dimensions.brandReputation, 100);

    const overallScore = findings.length === 0 ? 0 : Math.round((dimensions.initialAccess + dimensions.brandReputation + dimensions.dataExposure + dimensions.lateralMovement) / 4);

    return {
      domain,
      timestamp: new Date().toISOString(),
      overallScore,
      riskLevel: overallScore >= 70 ? RiskLevel.CRITICAL : overallScore >= 40 ? RiskLevel.HIGH : overallScore >= 15 ? RiskLevel.MEDIUM : RiskLevel.LOW,
      dimensions,
      findings,
      subdomains,
      attackPaths: [],
      dnsRecords: txtRecords.map(v => ({ type: 'TXT', value: v })),
      techStack: Array.from(techStack),
      securityHeaders: [],
      summary: findings.length === 0 ? "No immediate exposures identified in this local snapshot." : `Local Engine identified ${findings.length} findings across ${subdomains.length} assets.`
    };

  } catch (error) {
    throw new Error("Local intelligence engine failed to complete.");
  }
};
