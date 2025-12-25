
import React, { useState, useRef } from 'react';
import { ReconReport, RiskLevel, ConfidenceLevel, AttackPath, ReconFinding } from '../types';
import { RISK_COLORS } from '../constants';
import { 
  Globe, ExternalLink, Download, ArrowRight, Cloud, Share2, Target, 
  BarChart3, Shield, CheckCircle2, Terminal, X, Zap, ListChecks, 
  Fingerprint, Camera, Eye, Trash2, ImageIcon, Server, ShieldCheck, Sword, ChevronRight,
  FileText, List, Search, Box, Lock, Activity, Printer
} from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';
import ScoreGauge from './ScoreGauge';
import html2canvas from 'html2canvas';

interface DashboardProps {
  report: ReconReport;
}

const Dashboard: React.FC<DashboardProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedRemediation, setSelectedRemediation] = useState<ReconFinding | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [findingScreenshots, setFindingScreenshots] = useState<Record<string, string>>({});
  const reportRef = useRef<HTMLDivElement>(null);

  if (!report) return null;

  const safeSubdomains = Array.isArray(report.subdomains) ? report.subdomains : [];
  const safeFindings = Array.isArray(report.findings) ? report.findings : [];
  const safeAttackPaths = Array.isArray(report.attackPaths) ? report.attackPaths : [];
  const safeDnsRecords = Array.isArray(report.dnsRecords) ? report.dnsRecords : [];
  const safeSecurityHeaders = Array.isArray(report.securityHeaders) ? report.securityHeaders : [];
  const safeDimensions = report.dimensions || { initialAccess: 0, lateralMovement: 0, dataExposure: 0, brandReputation: 0 };

  const assetData = safeSubdomains.reduce((acc: any[], sd) => {
    if (!sd || !sd.category) return acc;
    const catName = sd.category.charAt(0).toUpperCase() + sd.category.slice(1);
    const existing = acc.find(item => item.name === catName);
    if (existing) existing.count++;
    else acc.push({ name: catName, count: 1 });
    return acc;
  }, []);

  const downloadScreenshot = (id: string) => {
    const dataUrl = findingScreenshots[id];
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `surfacex-proof-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCaptureScreenshot = async (targetFinding?: ReconFinding) => {
    const finding = targetFinding || selectedRemediation;
    if (!finding) return;
    
    setCapturing(true);
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:white;z-index:9999;opacity:0.8;pointer-events:none;transition:opacity 0.4s ease-out;';
    document.body.appendChild(flash);

    try {
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#020617',
        scale: 2, 
        logging: false,
        useCORS: true,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      setFindingScreenshots(prev => ({
        ...prev,
        [finding.id]: dataUrl
      }));

      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 400);
      });
    } catch (error) {
      console.error("Snapshot capture failed:", error);
      flash.remove();
    } finally {
      setCapturing(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      window.print();
    } finally {
      setExporting(false);
    }
  };

  const renderSummary = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Global Risk Posture</h3>
          <ScoreGauge score={report.overallScore || 0} />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${RISK_COLORS[report.riskLevel] || ''}`}>
              {report.riskLevel || 'Unknown'} Risk
            </span>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <BarChart3 size={16} /> Exposure Dimensions
            </h3>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Normalized Index (0-100)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(Object.entries(safeDimensions) as [string, number][]).map(([key, val]) => (
              <div key={key} className="bg-slate-950/50 border border-slate-800/50 p-4 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   {key === 'initialAccess' ? <Target size={32} /> : 
                    key === 'lateralMovement' ? <Share2 size={32} /> :
                    key === 'dataExposure' ? <Server size={32} /> : <Shield size={32} />}
                </div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 truncate">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-2xl font-bold text-white mb-2 block">{val || 0}</span>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${val > 70 ? 'bg-rose-500' : val > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${val || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row gap-6">
             <div className="flex-1">
               <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-3">Analyst Executive Summary</h4>
               <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4">
                 "{report.summary || 'Strategic overview pending completion of scan telemetry.'}"
               </p>
             </div>
             <div className="md:w-64 h-32">
                <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-3">Asset Distribution</h4>
                {/* Fixed height and min-height for ResponsiveContainer to avoid Recharts warning */}
                <div className="w-full h-full min-h-[100px]" style={{ minHeight: 100 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                        {assetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#6366f1" opacity={0.6} />
                        ))}
                      </Bar>
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px'}}
                        itemStyle={{color: '#818cf8', fontWeight: 'bold'}}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Target size={16} className="text-indigo-500" /> High Priority Findings
          </h3>
          <div className="space-y-4">
            {safeFindings.slice(0, 3).map((finding) => (
              <div key={finding.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-colors">
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white">{finding.title}</h4>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${RISK_COLORS[finding.severity] || ''}`}>{finding.severity}</span>
                 </div>
                 <p className="text-[11px] text-slate-500 line-clamp-1">{finding.description}</p>
                 <button onClick={() => { setSelectedRemediation(finding); setActiveTab('findings'); }} className="mt-2 text-[10px] text-indigo-400 font-bold flex items-center gap-1">View Details <ChevronRight size={10} /></button>
              </div>
            ))}
            {safeFindings.length === 0 && <p className="text-xs text-slate-600 italic py-10 text-center">No findings generated yet.</p>}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Share2 size={16} className="text-amber-500" /> Attack Correlation
          </h3>
          {safeAttackPaths.length > 0 ? (
            <div className="space-y-4">
              {safeAttackPaths.map((path) => (
                <div key={path.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Sword size={14} className="text-rose-500" /> {path.name}
                  </h4>
                  <div className="space-y-3 relative">
                    <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-slate-800" />
                    {path.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        </div>
                        <span className="text-xs text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-center px-10 h-full">
               <Sword size={24} className="text-slate-800 mb-4" />
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                 Intelligence engine is correlating <br /> potential lateral movement paths...
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <Globe size={16} className="text-indigo-500" /> Discovered Infrastructure
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-500 uppercase font-mono tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Endpoint</th>
              <th className="px-6 py-4 font-bold">IP Address</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Open Ports</th>
              <th className="px-6 py-4 font-bold">Service / Provider</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {safeSubdomains.map((sd, i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white font-mono">{sd.name}</td>
                <td className="px-6 py-4 text-slate-400 font-mono">{sd.ip}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] uppercase font-bold">
                    {sd.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {sd.ports.map(p => (
                      <span key={p} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        {p}
                      </span>
                    ))}
                    {sd.ports.length === 0 && <span className="text-slate-600 italic">None</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-medium">{sd.provider || 'Unidentified'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDNS = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Search size={16} className="text-indigo-500" /> Zone Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-500 font-mono uppercase">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Resource Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {safeDnsRecords.map((rec, i) => (
                <tr key={i} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-indigo-400 font-mono">{rec.type}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono break-all">{rec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Shield size={16} className="text-emerald-500" /> Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.techStack.map((tech, i) => (
              <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 flex items-center gap-2">
                <Box size={12} className="text-indigo-500" /> {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Lock size={16} className="text-amber-500" /> Security Headers
          </h3>
          <div className="space-y-3">
            {safeSecurityHeaders.map((header, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-300">{header.name}</span>
                {header.present ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : (
                  <X size={14} className="text-rose-500" />
                )}
              </div>
            ))}
            {safeSecurityHeaders.length === 0 && <p className="text-xs text-slate-600 italic">No header data captured.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['NIST CSF', 'CIS', 'ISO 27001'].map(framework => {
          const matched = safeFindings.filter(f => f.compliance?.some(c => c.framework === framework));
          return (
            <div key={framework} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-bold text-white">{framework}</h3>
                 <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{matched.length} Gaps</span>
              </div>
              <div className="space-y-4">
                 {matched.map(m => (
                    <div key={m.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                          {m.compliance?.find(c => c.framework === framework)?.control}
                       </span>
                       <p className="text-[11px] text-white font-medium line-clamp-1">{m.title}</p>
                    </div>
                 ))}
                 {matched.length === 0 && <div className="text-center py-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest">No Critical Gaps Discovered</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFindingsList = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in fade-in duration-500">
      <h3 className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-wider">
        <Target size={16} className="text-indigo-500" /> Vulnerability & Exposure Inventory
      </h3>
      <div className="space-y-4">
        {safeFindings.map((finding) => (
          <div key={finding.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${finding.severity === RiskLevel.CRITICAL ? 'bg-rose-500 animate-pulse' : finding.severity === RiskLevel.HIGH ? 'bg-orange-500' : 'bg-amber-500'}`} />
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{finding.title}</h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${RISK_COLORS[finding.severity] || ''}`}>{finding.severity}</span>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{finding.module}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {finding.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCaptureScreenshot(finding)}
                  disabled={capturing}
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Camera size={12} /> {capturing ? 'Capturing...' : 'Capture Proof'}
                </button>
                <button onClick={() => setSelectedRemediation(finding)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-500 transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20">
                  <ShieldCheck size={12} /> View Remediation
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">{finding.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] border-t border-slate-800/50 pt-4">
              <div>
                 <span className="text-slate-500 uppercase font-bold block mb-1">Affected Infrastructure</span>
                 <div className="font-mono text-indigo-300 flex items-center gap-1"><Globe size={10}/> {finding.affectedAsset}</div>
              </div>
              <div>
                 <span className="text-slate-500 uppercase font-bold block mb-1">Impact Analysis</span>
                 <p className="text-slate-400 italic line-clamp-1">"{finding.impact}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6" ref={reportRef}>
      {/* Tab Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl print:hidden">
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'summary', label: 'Summary', icon: <BarChart3 size={14} /> },
            { id: 'assets', label: 'Assets', icon: <Globe size={14} /> },
            { id: 'findings', label: 'Findings', icon: <Target size={14} /> },
            { id: 'dns', label: 'DNS & Tech', icon: <Search size={14} /> },
            { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all active:scale-95"
          >
            <Printer size={16} /> PRINT REPORT
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="print:block">
        <div className="hidden print:flex flex-col mb-10 border-b border-slate-800 pb-8">
           <h1 className="text-4xl font-black text-white mb-2">SurfaceX Enterprise Report</h1>
           <p className="text-slate-400 font-mono text-sm">Target Domain: {report.domain} | Timestamp: {new Date(report.timestamp).toLocaleString()}</p>
        </div>

        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'findings' && renderFindingsList()}
        {activeTab === 'dns' && renderDNS()}
        {activeTab === 'compliance' && renderCompliance()}
      </div>

      {/* Blueprint Modal */}
      {selectedRemediation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-hidden print:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedRemediation(null)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-500" /> Remediation Blueprint
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCaptureScreenshot(selectedRemediation)}
                  disabled={capturing}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <Camera size={14} /> {capturing ? 'Capturing...' : 'Capture Proof'}
                </button>
                <button onClick={() => setSelectedRemediation(null)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><X size={20} /></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border mb-2 inline-block ${RISK_COLORS[selectedRemediation.severity] || ''}`}>{selectedRemediation.severity} Severity</span>
                <h2 className="text-2xl font-black text-white leading-tight mb-2">{selectedRemediation.title}</h2>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <Globe size={12} /> {selectedRemediation.affectedAsset}
                </div>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-2xl relative overflow-hidden group">
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sword size={16} /> Exploitation Scenario
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed italic border-l-2 border-rose-500/30 pl-4">
                  "{selectedRemediation.threatActorContext || "Analysis of attacker methodology pending."}"
                </p>
              </div>

              {findingScreenshots[selectedRemediation.id] && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between mb-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                    <span>Evidence Snapshot</span>
                    <button onClick={() => downloadScreenshot(selectedRemediation.id)} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><Download size={14} /> Download</button>
                  </div>
                  <img src={findingScreenshots[selectedRemediation.id]} className="w-full rounded-2xl border border-slate-800 shadow-2xl" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Terminal size={12} /> Technical Evidence</h4>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-indigo-400 min-h-[100px] break-all">
                    {selectedRemediation.evidence}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Target size={12} /> Risk Impact</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedRemediation.impact}</p>
                </div>
              </div>

              <div className="bg-indigo-600/5 border border-indigo-600/20 p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ListChecks size={18} /> Remediation Strategy</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedRemediation.recommendation}</p>
              </div>
            </div>
            
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSelectedRemediation(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95">CLOSE ANALYSIS</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .bg-slate-900, .bg-slate-950, .bg-slate-800 { background: #f8fafc !important; border-color: #e2e8f0 !important; }
          .text-white, .text-slate-200, .text-slate-300 { color: #0f172a !important; }
          .text-slate-400, .text-slate-500 { color: #64748b !important; }
          .border { border-color: #e2e8f0 !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .animate-in { animation: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
