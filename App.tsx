
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DocsView from './components/DocsView';
import RiskModelView from './components/RiskModelView';
import { analyzeDomain } from './services/geminiService';
import { performLocalRecon } from './services/reconService';
import { ReconReport } from './types';
import { Search, Loader2, Shield, Globe, Info, Zap, Settings, Cloud, Share2, ShieldCheck, Cpu, Database, AlertCircle, AlertTriangle, X } from 'lucide-react';

export type AppView = 'home' | 'docs' | 'risk-model';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReconReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState('balanced');
  const [mode, setMode] = useState<'local' | 'intelligence'>('intelligence');

  // Handle ESC key to go back home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (error) {
          setError(null);
        } else if (report) {
          setReport(null);
        } else {
          setCurrentView('home');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [report, error]);

  const handleSearch = async (e?: React.FormEvent) => {
    // CRITICAL: Ensure event prevention is the very first thing to stop page reloads
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!domain) return;

    let normalized = domain.toLowerCase().trim();
    normalized = normalized.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Clear previous state
    setError(null);
    setReport(null);

    // Safe API key check to prevent ReferenceErrors crashing the component
    const getApiKey = () => {
      try {
        const win = window as any;
        if (win.SURFACEX_API_KEY) return win.SURFACEX_API_KEY;
        // Check for process.env safely
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
          return process.env.API_KEY;
        }
      } catch (err) {
        console.error("API Key check error", err);
      }
      return null;
    };

    if (mode === 'intelligence') {
      const apiKey = getApiKey();
      if (!apiKey) {
        setError("API Key Required for AI Intelligence Mode. Please set your key in the browser console using: window.SURFACEX_API_KEY = 'your_key' or add it to your .env file. Alternatively, switch to 'LOCAL SNAPSHOT' mode for zero-key scanning.");
        return;
      }
    }

    setLoading(true);
    setCurrentView('home'); 
    
    try {
      let result: ReconReport;
      if (mode === 'local') {
        result = await performLocalRecon(normalized);
      } else {
        result = await analyzeDomain(normalized, depth);
      }
      setReport(result);
    } catch (err: any) {
      console.error("Scan failed:", err);
      setError(err.message || 'The scan engine encountered an unexpected error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchHero = () => (
    <div className="max-w-4xl mx-auto text-center py-16 md:py-24 space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">
          <Zap size={14} className="text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Enterprise Asset Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
          Know Your Surface <br /> <span className="text-indigo-500 underline decoration-indigo-500/30 decoration-8 underline-offset-8">Before They Do.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          The professional EASM tool for mapping enterprise exposure, cloud leakage, and theoretical attack paths.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-center">
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex gap-1">
            <button 
              type="button"
              onClick={() => { setMode('intelligence'); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${mode === 'intelligence' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Cpu size={16} /> AI INTELLIGENCE
            </button>
            <button 
              type="button"
              onClick={() => { setMode('local'); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${mode === 'local' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Database size={16} /> LOCAL SNAPSHOT (NO API)
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-2xl opacity-10 group-focus-within:opacity-25 transition-opacity" />
          <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-slate-900 border border-slate-700 rounded-2xl p-2 focus-within:border-indigo-500 transition-all shadow-2xl">
            <div className="flex items-center flex-1">
              <div className="pl-4 pr-3">
                <Globe className="text-slate-500" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Target domain (e.g. cloud-enterprise.com)"
                className="flex-1 bg-transparent border-none outline-none py-4 text-white placeholder-slate-500 font-bold text-lg"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              {loading ? 'CALCULATING...' : mode === 'local' ? 'START LOCAL RECON' : 'ANALYZE SURFACE'}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-6 items-center">
          {mode === 'intelligence' && (
            <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl">
              <Settings size={14} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Depth</span>
              <select 
                className="bg-transparent text-indigo-400 font-bold text-xs border-none outline-none cursor-pointer"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              >
                <option value="balanced">Balanced</option>
                <option value="deep">Deep Intelligence</option>
                <option value="rapid">Rapid Snapshot</option>
              </select>
            </div>
          )}
          <div className="h-4 w-px bg-slate-800 hidden md:block" />
          <div className="flex gap-4">
             {mode === 'local' ? (
               <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                 <ShieldCheck size={12} /> Live DNS Query (Cloudflare)
               </span>
             ) : (
               ['Cloud Detection', 'Attack Paths', 'Compliance'].map(feature => (
                 <span key={feature} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <Shield size={12} className="text-indigo-500/50" /> {feature}
                 </span>
               ))
             )}
          </div>
        </div>

        {mode === 'local' && (
          <div className="max-w-xl mx-auto flex items-start gap-3 bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-left">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] text-amber-500 font-medium leading-relaxed uppercase tracking-wider">
              Note: Local Mode is subject to browser security restrictions. For full port scanning, vulnerability prediction, and historical CT logs, use <strong>AI Intelligence Mode</strong>.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
        {[
          { icon: <Cloud className="text-indigo-400" />, title: 'Cloud Visibility', desc: 'Auto-discover exposed S3 buckets, Azure blobs, and SaaS login gateways.' },
          { icon: <Share2 className="text-indigo-400" />, title: 'Attack Correlation', desc: 'Heuristic-based attack path simulation chaining multiple low-risk exposures.' },
          { icon: <ShieldCheck className="text-indigo-400" />, title: 'SOC Integration', desc: 'JSON-ready findings mapped to NIST CSF and CIS frameworks.' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl hover:border-indigo-500/30 transition-all hover:bg-slate-900/60 group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-white font-black text-lg mb-3 tracking-tight">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="max-w-2xl mx-auto text-center py-24 space-y-12 animate-pulse">
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full" />
        <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="text-indigo-500" size={48} />
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-white tracking-tight">SurfaceX {mode === 'local' ? 'Local' : 'Intelligence'} Engine</h2>
           <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]">{mode === 'local' ? 'Performing Real-Time DNS & CT Lookups' : 'Orchestrating Multi-Vector OSINT Recon'}</p>
        </div>
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[loading_3s_ease-in-out_infinite]" />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
             <span>{mode === 'local' ? 'FETCHING_CT_LOGS' : 'CORRELATING_BUCKETS'}</span>
             <span>{mode === 'local' ? 'PROBING_DISCOVERED_ASSETS' : 'SIMULATING_PATHS'}</span>
             <span>{mode === 'local' ? 'VERIFYING_WEB_GATEWAYS' : 'MAPPING_NIST_CSF'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={() => setError(null)}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="text-rose-500" size={32} />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-rose-500 font-black text-xs uppercase tracking-widest">Configuration Required</h4>
            <h2 className="text-2xl font-black text-white leading-tight">Intelligence Engine Locked</h2>
          </div>
          
          <p className="text-sm text-slate-400 leading-relaxed">
            {error}
          </p>
          
          <div className="w-full pt-4 space-y-3">
            <button 
              type="button"
              onClick={() => { setMode('local'); setError(null); }}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
            >
              Switch to Local Mode
            </button>
            <button 
              type="button"
              onClick={() => setError(null)}
              className="w-full py-4 bg-slate-800 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all active:scale-95"
            >
              I'll add the key now
            </button>
          </div>
          
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
            Tip: Press Esc to dismiss
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {loading ? (
        renderLoading()
      ) : currentView === 'docs' ? (
        <DocsView onBack={() => setCurrentView('home')} />
      ) : currentView === 'risk-model' ? (
        <RiskModelView onBack={() => setCurrentView('home')} />
      ) : report ? (
        <Dashboard report={report} />
      ) : (
        <>
          {renderSearchHero()}
          {error && renderError()}
        </>
      )}
      
      {report && (
        <div className="fixed bottom-10 right-10 z-50">
          <button 
            type="button"
            onClick={() => { setReport(null); setDomain(''); setCurrentView('home'); }}
            className="group flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white px-6 py-3 rounded-2xl shadow-2xl transition-all hover:-translate-y-1"
          >
            <Search size={18} />
            <span className="text-xs font-black uppercase tracking-widest">New Snapshot</span>
            <kbd className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-bold text-slate-500">Esc</kbd>
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
