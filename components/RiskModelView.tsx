
import React from 'react';
import { 
  BarChart3, ArrowLeft, Target, Share2, Server, Shield, 
  TrendingUp, AlertCircle, Info, PieChart
} from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskModelViewProps {
  onBack: () => void;
}

const RiskModelView: React.FC<RiskModelViewProps> = ({ onBack }) => {
  const data = [
    { name: 'Initial Access', value: 25, color: '#6366f1' },
    { name: 'Lateral Movement', value: 25, color: '#818cf8' },
    { name: 'Data Exposure', value: 25, color: '#c084fc' },
    { name: 'Brand Reputation', value: 25, color: '#f472b6' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
            <TrendingUp size={14} /> Intelligence Scoring
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Risk Quantification Model</h1>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      {/* Model Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white">The 4-Dimension Framework</h2>
          <p className="text-slate-400 leading-relaxed">
            SurfaceX calculates risk by analyzing four distinct vectors of external exposure. Unlike traditional vulnerability scanners that focus only on CVEs, we look at <span className="text-white font-bold">Heuristic Blast Radius</span>.
          </p>
          <div className="space-y-4">
            {data.map(d => (
              <div key={d.name} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm font-bold text-slate-300">{d.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">25.0% Weight</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-64 relative bg-slate-900/30 rounded-full flex items-center justify-center border border-slate-800/50">
           <ResponsiveContainer width="100%" height="100%">
             <RePie>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={90}
                 paddingAngle={5}
                 dataKey="value"
                 stroke="none"
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip 
                 contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px'}}
                 itemStyle={{color: '#fff', fontWeight: 'bold'}}
               />
             </RePie>
           </ResponsiveContainer>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Shield className="text-indigo-500/20" size={48} />
           </div>
        </div>
      </div>

      {/* Scoring Legend */}
      <section className="space-y-8">
        <h2 className="text-xl font-black text-white flex items-center gap-3">
          <BarChart3 className="text-indigo-500" size={24} /> Severity Thresholds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { range: '00-14', level: 'Low', color: 'bg-emerald-500', desc: 'Minimal exposure. Hardened posture with standard headers and valid encryption.' },
            { range: '15-39', level: 'Medium', color: 'bg-amber-500', desc: 'Operational hygiene issues. Missing security headers or informational DNS gaps.' },
            { range: '40-69', level: 'High', color: 'bg-orange-500', desc: 'Active exposure detected. Exposed dev environments or weak email protection.' },
            { range: '70-100', level: 'Critical', color: 'bg-rose-500', desc: 'High blast-radius findings. Exposed management portals or leaked cloud assets.' }
          ].map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className={`${s.color} w-full h-1.5 rounded-full`} />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest uppercase">{s.range} INDEX</span>
                <h3 className="text-lg font-black text-white">{s.level}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dimension Logic */}
      <section className="space-y-8">
        <h2 className="text-xl font-black text-white">Dimension Logic Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: <Target className="text-indigo-400" />, title: 'Initial Access', detail: 'The likelihood of an attacker gaining a foothold. Driven by exposed login forms, unpatched web servers, and lack of HSTS.' },
            { icon: <Share2 className="text-indigo-400" />, title: 'Lateral Movement', detail: 'The ease of navigating between assets. Driven by asset density, internal naming conventions, and DNS zone sprawl.' },
            { icon: <Server className="text-indigo-400" />, title: 'Data Exposure', detail: 'The risk of direct sensitive data theft. Driven by exposed APIs, cloud storage buckets, and dev/staging leaks.' },
            { icon: <Shield className="text-indigo-400" />, title: 'Brand Reputation', detail: 'The risk of phishing or impersonation. Driven by MX records, SPF/DMARC health, and expired SSL certificates.' }
          ].map((dim, i) => (
            <div key={i} className="flex gap-6 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0">
                {dim.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{dim.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{dim.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Math Logic */}
      <div className="bg-indigo-600/5 border border-indigo-600/20 p-8 rounded-3xl">
        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Info size={16} /> Confidence Weighting
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-mono">
          Final Score = Σ (Dimension Score * Weight) * Confidence_Factor
        </p>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed italic">
          Confidence Factor is derived from the "Passive vs. Active" verification ratio. Findings backed by live HTTP handshakes receive a 1.0 multiplier, while predictive OSINT findings receive a 0.7 multiplier.
        </p>
      </div>
    </div>
  );
};

export default RiskModelView;
