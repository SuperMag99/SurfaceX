
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DocsView from './components/DocsView';
import RiskModelView from './components/RiskModelView';
import { analyzeDomain } from './services/geminiService';
import { performLocalRecon } from './services/reconService';
import { ReconReport } from './types';
import { Search, Loader2, Shield, Globe, Info, Zap, Settings, Cloud, Share2, ShieldCheck, Cpu, Database, AlertCircle, AlertTriangle, X, ChevronRight, Activity } from 'lucide-react';

export type AppView = 'home' | 'docs' | 'risk-model';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReconReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState('balanced');
  const [mode, setMode] = useState<'local' | 'intelligence'>('intelligence');
  const [apiKey, setApiKey] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

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

    setLoading(true);
    setCurrentView('home'); 
    
    try {
      let result: ReconReport;
      if (mode === 'local') {
        result = await performLocalRecon(normalized);
      } else {
        if (!apiKey) {
          setError('Please provide your Gemini API Key to use AI Intelligence Mode.');
          setLoading(false);
          return;
        }
        result = await analyzeDomain(normalized, depth, apiKey);
      }
      setReport(result);
    } catch (err: any) {
      console.error("Scan failed:", err);
      setError(err.message || 'The scan engine encountered an unexpected error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const renderDisclaimerModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0B0E14] border border-indigo-500/30 rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-[0_0_80px_-15px_rgba(99,102,241,0.2)] relative overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
          <Shield className="text-indigo-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Privacy First & Ephemeral Session</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-8">
          <p>This is the initial version of SurfaceX Intelligence.</p>
          <div className="bg-[#0F111A] border border-indigo-500/20 p-4 rounded-2xl flex items-start gap-4">
            <Info className="text-indigo-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <strong className="text-indigo-300 block text-sm">No Data Stored</strong>
              <p className="text-slate-400 text-xs">
                The entire application runs directly from your volatile memory. There are no databases attached to this tool.
              </p>
              <p className="text-slate-400 text-xs">
                All intelligence scans, input domains, API keys, and target maps will be permanently destroyed when you close this window or end the active session.
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowDisclaimer(false)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98]"
        >
          Close
        </button>
=======
  const renderSearchHero = () => (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">System Ready</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Attack Surface <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Intelligence</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl font-medium">
            Map enterprise exposure, cloud leakage, and theoretical attack paths with passive precision.
          </p>
        </div>
        
        {/* Mode Toggle Pills */}
        <div className="bg-[#0F111A] p-1.5 rounded-2xl border border-white/5 flex gap-1 shadow-2xl">
          <button 
            type="button"
            onClick={() => { setMode('intelligence'); setError(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'intelligence' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Cpu size={14} /> AI INTELLIGENCE
          </button>
          <button 
            type="button"
            onClick={() => { setMode('local'); setError(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'local' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Database size={14} /> LOCAL SNAPSHOT
          </button>
        </div>
      </div>

      {/* Main Search Input Card */}
      <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-1 shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="bg-[#0F111A] rounded-[20px] p-8 md:p-10 relative z-10">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Target Asset Domain</label>
              <div className="relative group/input">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Globe className="text-indigo-500 group-focus-within/input:text-indigo-400 transition-colors" size={24} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="e.g. cloud-enterprise.com"
                   className="w-full bg-[#0B0E14] border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-xl md:text-2xl text-white font-medium placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                   value={domain}
                   onChange={(e) => setDomain(e.target.value)}
                 />
                 <div className="absolute inset-y-0 right-3 flex items-center">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
                    </button>
                 </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {mode === 'intelligence' && (
                <div className="flex items-center gap-3 bg-[#0B0E14] border border-white/5 px-4 py-2.5 rounded-xl">
                  <Settings size={14} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scan Depth</span>
                  <div className="h-4 w-px bg-white/10 mx-1" />
                  <select 
                    className="bg-transparent text-indigo-400 font-bold text-xs border-none outline-none cursor-pointer focus:ring-0"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                  >
                    <option value="balanced">Balanced</option>
                    <option value="deep">Deep Intelligence</option>
                    <option value="rapid">Rapid Snapshot</option>
                  </select>
                </div>
              )}
              
              <div className="flex-1" />

              <div className="flex gap-6 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-2"><Cloud size={14} className="text-indigo-500/50" /> Cloud Visibility</span>
                <span className="flex items-center gap-2"><Share2 size={14} className="text-indigo-500/50" /> Attack Paths</span>
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500/50" /> Compliance</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Activity className="text-indigo-400" />, title: 'Real-time Recon', desc: 'Live passive DNS & CT log analysis.' },
          { icon: <Cpu className="text-violet-400" />, title: 'AI Correlation', desc: 'LLM-driven risk heuristics & mapping.' },
          { icon: <Shield className="text-emerald-400" />, title: 'Defensive Intel', desc: 'Actionable output for SOC teams.' }
        ].map((item, i) => (
          <div key={i} className="bg-[#0F111A] border border-white/5 p-6 rounded-3xl hover:border-indigo-500/20 transition-all group">
            <div className="flex items-start justify-between mb-4">
               <div className="w-10 h-10 bg-[#0B0E14] border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 {item.icon}
               </div>
               <ChevronRight className="text-slate-700 group-hover:text-indigo-500 transition-colors" size={16} />
            </div>
            <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
>>>>>>> 1aa9e1e8de0983f6c5f4004aa53d4f5f281c194b
      </div>

      {/* Local Mode Warning */}
      {mode === 'local' && (
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-amber-500/80 font-medium leading-relaxed">
            <strong className="text-amber-500 block mb-1">Restricted Capabilities Active</strong>
            Local Mode is subject to browser security restrictions (CORS). For full port scanning, vulnerability prediction, and historical data, switch to <strong>AI Intelligence Mode</strong>.
          </p>
        </div>
      )}
    </div>
  );

<<<<<<< HEAD
  const renderSearchHero = () => (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">System Ready - Initial Version</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Attack Surface <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Intelligence</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl font-medium">
            Map enterprise exposure, cloud leakage, and theoretical attack paths with passive precision.
          </p>
        </div>
        
        {/* Mode Toggle Pills */}
        <div className="bg-[#0F111A] p-1.5 rounded-2xl border border-white/5 flex gap-1 shadow-2xl">
          <button 
            type="button"
            onClick={() => { setMode('intelligence'); setError(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'intelligence' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Cpu size={14} /> AI INTELLIGENCE
          </button>
          <button 
            type="button"
            onClick={() => { setMode('local'); setError(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'local' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Database size={14} /> LOCAL SNAPSHOT
          </button>
        </div>
      </div>

      {/* Main Search Input Card */}
      <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-1 shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="bg-[#0F111A] rounded-[20px] p-8 md:p-10 relative z-10">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Target Asset Domain</label>
              <div className="relative group/input">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Globe className="text-indigo-500 group-focus-within/input:text-indigo-400 transition-colors" size={24} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="e.g. cloud-enterprise.com"
                   className="w-full bg-[#0B0E14] border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-xl md:text-2xl text-white font-medium placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                   value={domain}
                   onChange={(e) => setDomain(e.target.value)}
                 />
                 <div className="absolute inset-y-0 right-3 flex items-center">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
                    </button>
                 </div>
              </div>
            </div>

            {/* API Key Input for Intelligence Mode */}
            {mode === 'intelligence' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Gemini API Key</label>
                <div className="relative group/key">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Settings className="text-slate-600 group-focus-within/key:text-indigo-400 transition-colors" size={20} />
                   </div>
                   <input 
                     type="password" 
                     placeholder="AI Key (Required for AI Analysis)"
                     className="w-full bg-[#0B0E14] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white font-medium placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                     value={apiKey}
                     onChange={(e) => setApiKey(e.target.value)}
                   />
                </div>
              </div>
            )}

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {mode === 'intelligence' && (
                <div className="flex items-center gap-3 bg-[#0B0E14] border border-white/5 px-4 py-2.5 rounded-xl">
                  <Settings size={14} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scan Depth</span>
                  <div className="h-4 w-px bg-white/10 mx-1" />
                  <select 
                    className="bg-transparent text-indigo-400 font-bold text-xs border-none outline-none cursor-pointer focus:ring-0"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                  >
                    <option value="balanced">Balanced</option>
                    <option value="deep">Deep Intelligence</option>
                    <option value="rapid">Rapid Snapshot</option>
                  </select>
                </div>
              )}
              
              <div className="flex-1" />

              <div className="flex gap-6 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-2"><Cloud size={14} className="text-indigo-500/50" /> Cloud Visibility</span>
                <span className="flex items-center gap-2"><Share2 size={14} className="text-indigo-500/50" /> Attack Paths</span>
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500/50" /> Compliance</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Activity className="text-indigo-400" />, title: 'Real-time Recon', desc: 'Live passive DNS & CT log analysis.' },
          { icon: <Cpu className="text-violet-400" />, title: 'AI Correlation', desc: 'LLM-driven risk heuristics & mapping.' },
          { icon: <Shield className="text-emerald-400" />, title: 'Defensive Intel', desc: 'Actionable output for SOC teams.' }
        ].map((item, i) => (
          <div key={i} className="bg-[#0F111A] border border-white/5 p-6 rounded-3xl hover:border-indigo-500/20 transition-all group">
            <div className="flex items-start justify-between mb-4">
               <div className="w-10 h-10 bg-[#0B0E14] border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 {item.icon}
               </div>
               <ChevronRight className="text-slate-700 group-hover:text-indigo-500 transition-colors" size={16} />
            </div>
            <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Local Mode Warning */}
      {mode === 'local' && (
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-amber-500/80 font-medium leading-relaxed">
            <strong className="text-amber-500 block mb-1">Restricted Capabilities Active</strong>
            Local Mode is subject to browser security restrictions (CORS). For full port scanning, vulnerability prediction, and historical data, switch to <strong>AI Intelligence Mode</strong>.
          </p>
        </div>
      )}
    </div>
  );

  const renderLoading = () => (
    <div className="max-w-2xl mx-auto py-24 flex flex-col items-center text-center space-y-12 animate-in fade-in duration-1000">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 border border-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Shield className="text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={64} />
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-1.5 animate-bounce">
              <Activity size={12} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 w-full max-w-sm">
        <div className="space-y-2">
           <h2 className="text-3xl font-bold text-white tracking-tight">Initializing Scan</h2>
           <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
             {mode === 'local' ? 'Targeting Local Resolvers' : 'Establishing Neural Uplink'}
           </p>
        </div>
        
        <div className="space-y-4">
          <div className="h-1.5 w-full bg-[#0B0E14] rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 animate-[loading_2s_ease-in-out_infinite]" />
          </div>
=======
  const renderLoading = () => (
    <div className="max-w-2xl mx-auto py-24 flex flex-col items-center text-center space-y-12 animate-in fade-in duration-1000">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 border border-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Shield className="text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={64} />
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-1.5 animate-bounce">
              <Activity size={12} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 w-full max-w-sm">
        <div className="space-y-2">
           <h2 className="text-3xl font-bold text-white tracking-tight">Initializing Scan</h2>
           <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
             {mode === 'local' ? 'Targeting Local Resolvers' : 'Establishing Neural Uplink'}
           </p>
        </div>
        
        <div className="space-y-4">
          <div className="h-1.5 w-full bg-[#0B0E14] rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 animate-[loading_2s_ease-in-out_infinite]" />
          </div>
>>>>>>> 1aa9e1e8de0983f6c5f4004aa53d4f5f281c194b
          <div className="flex justify-between text-[10px] font-mono font-medium text-slate-500 uppercase">
             <span>Discovery</span>
             <span>Correlation</span>
             <span>Synthesis</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-[#0F111A] border border-rose-500/20 rounded-3xl p-8 shadow-2xl shadow-rose-900/10 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
        
        <button 
          onClick={() => setError(null)}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
            <AlertTriangle className="text-rose-500" size={32} />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-rose-500 font-bold text-xs uppercase tracking-widest">System Alert</h4>
            <h2 className="text-2xl font-bold text-white leading-tight">Operation Terminated</h2>
          </div>
          
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            {error}
          </p>
          
          <div className="w-full pt-4 space-y-3">
            <button 
              type="button"
              onClick={() => { setMode('local'); setError(null); }}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
            >
              Switch to Local Mode
            </button>
            <button 
              type="button"
              onClick={() => setError(null)}
              className="w-full py-4 bg-[#0B0E14] text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all active:scale-95"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {showDisclaimer && renderDisclaimerModal()}
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
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            type="button"
            onClick={() => { setReport(null); setDomain(''); setCurrentView('home'); }}
            className="group flex items-center gap-3 bg-[#0B0E14]/90 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white px-6 py-4 rounded-2xl shadow-2xl transition-all hover:-translate-y-1"
          >
            <Search size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">New Scan</span>
            <kbd className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 font-bold text-slate-500 group-hover:text-slate-300">Esc</kbd>
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
