
import React from 'react';
import { 
  Book, ArrowLeft, Shield, Search, Globe, Cloud, 
  Lock, Terminal, Zap, CheckCircle2, AlertTriangle, Cpu
} from 'lucide-react';

interface DocsViewProps {
  onBack: () => void;
}

const DocsView: React.FC<DocsViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
            <Book size={14} /> Knowledge Base
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Technical Documentation</h1>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      {/* Architecture Section */}
      <section className="space-y-8">
        <h2 className="text-xl font-black text-white flex items-center gap-3">
          <Cpu className="text-indigo-500" size={24} /> Analysis Pipeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-slate-800 -z-10" />
          {[
            { step: '01', title: 'Target Normalization', icon: <Search />, desc: 'Cleaning protocols and handling root-domain resolution.' },
            { step: '02', title: 'Passive Discovery', icon: <Globe />, desc: 'Querying CT logs and DNS records (MX, TXT, SPF).' },
            { step: '03', title: 'Intelligence Synthesis', icon: <Cpu />, desc: 'AI-driven correlation of assets into risk findings.' },
            { step: '04', title: 'Remediation', icon: <Shield />, desc: 'Mapping exposures to compliance frameworks (NIST/CIS).' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                {item.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest">{item.step}</span>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-8">
        <h2 className="text-xl font-black text-white">Methodology & Ethics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={16} /> Permitted Actions
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                Querying public Certificate Transparency (CT) logs via crt.sh.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                DNS resolution via Cloudflare DNS-over-HTTPS (DoH).
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                Browser-native HTTP/S handshake (Mode: no-cors) for port verification.
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} /> Restricted Actions
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                No brute-force directory or subdomain discovery.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                No exploitation of software vulnerabilities (CVEs).
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                No bypass of CAPTCHAs, 2FA, or WAF blocklists.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Analysis Modules */}
      <section className="space-y-8">
        <h2 className="text-xl font-black text-white">Module Deep-Dive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              title: 'Subdomain Discovery', 
              icon: <Search />, 
              tech: 'CT Logs + Passive DNS',
              detail: 'Identifies associated infrastructure by analyzing SSL/TLS certificates issued to the target. This reveals hidden dev/staging sites.' 
            },
            { 
              title: 'Email Security Analysis', 
              icon: <Globe />, 
              tech: 'SPF, DMARC, MX Records',
              detail: 'Checks for missing or misconfigured mail records that could lead to high-deliverability phishing or spoofing attacks.' 
            },
            { 
              title: 'Cloud Leak Detection', 
              icon: <Cloud />, 
              tech: 'Heuristic Pattern Matching',
              detail: 'Analyzes subdomain names (e.g., storage, s3, bucket) to predict and verify exposure of cloud resources.' 
            },
            { 
              title: 'Encryption (TLS/SSL)', 
              icon: <Lock />, 
              tech: 'Handshake Metadata',
              detail: 'Evaluates the strength of cryptographic controls, certificate validity, and issuer trust levels.' 
            }
          ].map((mod, i) => (
            <div key={i} className="group p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-indigo-500 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  {mod.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{mod.title}</h3>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">{mod.tech}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{mod.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center pt-12">
        <p className="text-xs text-slate-500 italic">For further details, consult the SurfaceX whitepaper or open an issue on our GitHub repository.</p>
      </div>
    </div>
  );
};

export default DocsView;
