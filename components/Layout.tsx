import React, { useState } from 'react';
import {
  Shield,
  Github,
  Linkedin,
  Menu,
  Home,
  Book,
  Activity
} from 'lucide-react';

import { APP_NAME, APP_TAGLINE, LEGAL_DISCLAIMER } from '../constants';
import { AppView } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  setCurrentView
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'docs', label: 'Documentation', icon: <Book size={20} /> },
    { id: 'risk-model', label: 'Risk Model', icon: <Activity size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 flex overflow-hidden">

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0B0E14]
          border-r border-white/5 flex flex-col transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="p-8">
          <div
            className="flex items-center gap-3 cursor-pointer mb-8"
            onClick={() => {
              setCurrentView('home');
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              <Shield className="text-white" size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">{APP_NAME}</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {APP_TAGLINE}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/10" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as AppView);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                transition-all
                ${
                  currentView === item.id
                    ? 'bg-indigo-600/10 text-white border border-indigo-500/20'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* Links */}
          <div className="mt-10 border-t border-white/5 pt-6">
            <p className="text-[10px] text-slate-600 mb-3 uppercase tracking-widest">
              Resources
            </p>

            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/VectrionX"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <Github size={18} /> GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/mag99/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
          </div>
        </nav>

        {/* Footer card */}
        <div className="p-6 mt-auto">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
            <h4 className="text-white font-bold text-sm">SurfaceX</h4>
            <p className="text-[10px] text-indigo-300">Enterprise Recon Tool</p>

            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-500">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex justify-between items-center p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield size={18} />
            <span className="font-bold">{APP_NAME}</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-white/5 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>

          {/* Footer */}
          <footer className="mt-20 border-t border-white/5 pt-6 text-center text-[10px] text-slate-600">
            &copy; {new Date().getFullYear()} {APP_NAME} — Defensive Use Only
            <div className="mt-2 italic">
              {LEGAL_DISCLAIMER?.slice(0, 120)}...
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;