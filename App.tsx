import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DocsView from './components/DocsView';
import RiskModelView from './components/RiskModelView';
import { analyzeDomain } from './services/geminiService';
import { performLocalRecon } from './services/reconService';
import { ReconReport } from './types';
import {
  Search,
  Loader2,
  Shield,
  Globe,
  Info,
  Zap,
  Settings,
  Cloud,
  Share2,
  ShieldCheck,
  Cpu,
  Database,
  AlertCircle,
  AlertTriangle,
  X,
  ChevronRight,
  Activity
} from 'lucide-react';

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

  // ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (error) setError(null);
        else if (report) setReport(null);
        else setCurrentView('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [error, report]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!domain) return;

    let normalized = domain.toLowerCase().trim();
    normalized = normalized.replace(/^https?:\/\//, '').replace(/\/$/, '');

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
      console.error(err);
      setError(err.message || 'Scan failed unexpectedly.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HERO ---------------- */
  const renderSearchHero = () => (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              System Ready
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Attack Surface <span className="text-indigo-400">Intelligence</span>
          </h1>

          <p className="text-slate-400 max-w-xl">
            Map enterprise exposure and attack paths with passive reconnaissance.
          </p>
        </div>

        {/* Mode Switch */}
        <div className="bg-[#0F111A] p-1.5 rounded-2xl border border-white/5 flex gap-1">
          <button
            onClick={() => setMode('intelligence')}
            className={`px-4 py-2 text-xs font-bold rounded-xl ${
              mode === 'intelligence' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            AI MODE
          </button>
          <button
            onClick={() => setMode('local')}
            className={`px-4 py-2 text-xs font-bold rounded-xl ${
              mode === 'local' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            LOCAL
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#0F111A] p-8 rounded-3xl border border-white/5">
        <form onSubmit={handleSearch} className="space-y-6">

          <input
            type="text"
            placeholder="Enter domain (e.g. example.com)"
            className="w-full bg-[#0B0E14] text-white p-5 rounded-2xl border border-white/10"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          {mode === 'intelligence' && (
            <input
              type="password"
              placeholder="Gemini API Key"
              className="w-full bg-[#0B0E14] text-white p-4 rounded-2xl border border-white/10"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          )}

          <div className="flex items-center gap-4">
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="bg-[#0B0E14] text-white p-3 rounded-xl"
            >
              <option value="balanced">Balanced</option>
              <option value="deep">Deep</option>
              <option value="rapid">Rapid</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-indigo-600 px-6 py-3 rounded-xl text-white font-bold"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Scan'}
            </button>
          </div>
        </form>
      </div>

      {/* Warning */}
      {mode === 'local' && (
        <div className="bg-yellow-500/10 p-4 rounded-xl text-yellow-400 text-sm">
          Local mode has limited capabilities due to browser restrictions.
        </div>
      )}
    </div>
  );

  /* ---------------- LOADING ---------------- */
  const renderLoading = () => (
    <div className="text-center py-24 text-white">
      <Loader2 className="animate-spin mx-auto mb-4" size={48} />
      <p>Running reconnaissance...</p>
    </div>
  );

  /* ---------------- ERROR ---------------- */
  const renderError = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
      <div className="bg-[#111] p-8 rounded-2xl text-white max-w-md">
        <AlertTriangle className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="text-sm text-slate-300">{error}</p>

        <button
          onClick={() => setError(null)}
          className="mt-6 w-full bg-red-600 py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {loading ? (
        renderLoading()
      ) : report ? (
        <Dashboard report={report} />
      ) : (
        <>
          {renderSearchHero()}
          {error && renderError()}
        </>
      )}
    </Layout>
  );
};

export default App;