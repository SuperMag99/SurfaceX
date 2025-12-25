
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum ConfidenceLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface ComplianceMapping {
  framework: 'NIST CSF' | 'CIS' | 'ISO 27001';
  control: string;
  description: string;
}

export interface ReconFinding {
  id: string;
  module: string;
  category: string;
  title: string;
  description: string;
  severity: RiskLevel;
  confidence: ConfidenceLevel;
  evidence: string;
  affectedAsset: string; // The specific subdomain or URL affected
  impact: string;
  recommendation: string;
  threatActorContext?: string; // e.g. "Commonly abused by Ransomware groups"
  compliance?: ComplianceMapping[];
}

export interface AttackPath {
  id: string;
  name: string;
  steps: string[];
  riskLevel: RiskLevel;
  likelihood: 'High' | 'Medium' | 'Low';
}

export interface Subdomain {
  name: string;
  ip: string;
  category: 'auth' | 'remote' | 'email' | 'admin' | 'dev' | 'cloud' | 'saas' | 'third-party';
  ports: number[];
  tags: string[];
  provider?: string; // AWS, Azure, GCP, Cloudflare
}

export interface RiskDimensions {
  initialAccess: number;
  lateralMovement: number;
  dataExposure: number;
  brandReputation: number;
}

export interface ReconReport {
  domain: string;
  timestamp: string;
  overallScore: number;
  riskLevel: RiskLevel;
  dimensions: RiskDimensions;
  findings: ReconFinding[];
  subdomains: Subdomain[];
  attackPaths: AttackPath[];
  dnsRecords: { type: string; value: string; }[];
  techStack: string[];
  securityHeaders: { name: string; present: boolean; value?: string; }[];
  summary: string;
}
