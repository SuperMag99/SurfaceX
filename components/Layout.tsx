
import React from 'react';
import { Shield, Github, Linkedin } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, LEGAL_DISCLAIMER } from '../constants';
import { AppView } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{APP_NAME}</h1>
              <p className="text-xs text-slate-400 font-medium">{APP_TAGLINE}</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentView('docs')}
              className={`text-sm font-bold transition-colors uppercase tracking-widest text-[10px] ${currentView === 'docs' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Documentation
            </button>
            <button 
              onClick={() => setCurrentView('risk-model')}
              className={`text-sm font-bold transition-colors uppercase tracking-widest text-[10px] ${currentView === 'risk-model' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Risk Model
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-800">
              <a href="https://github.com/SuperMag99" target="_blank" rel="noreferrer">
                <Github className="text-slate-400 hover:text-white cursor-pointer transition-colors" size={18} />
              </a>
              <a href="https://www.linkedin.com/in/mag99/" target="_blank" rel="noreferrer">
                <Linkedin className="text-slate-400 hover:text-white cursor-pointer transition-colors" size={18} />
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-indigo-500" size={20} />
                <span className="font-bold text-white">{APP_NAME}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Open-source attack surface snapshot tool for security professionals. Built for transparency, speed, and explainable risk.
              </p>
              <div className="flex gap-4">
                <span className="text-[10px] font-black px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase tracking-widest">
                  MIT License
                </span>
                <span className="text-[10px] font-black px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase tracking-widest">
                  v1.2.0-stable
                </span>
              </div>
            </div>
            
            <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-xl">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Legal Disclaimer</h4>
              <p className="text-xs text-slate-400 italic leading-relaxed">
                {LEGAL_DISCLAIMER}
              </p>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} {APP_NAME}. For Defensive and Authorized Research Only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
