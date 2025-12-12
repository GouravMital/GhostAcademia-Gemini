
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive 
        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
        : "text-zinc-400 hover:text-white hover:bg-white/5"
    }`;
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 border-b-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mr-3 shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                Ghost<span className="text-indigo-500">Academy</span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-4 items-center">
              <Link to="/verify" className={getLinkClass('/verify')}>Verify</Link>
              <Link to="/exam" className={getLinkClass('/exam')}>Exam</Link>
              <Link to="/issuer" className={getLinkClass('/issuer')}>Issuer</Link>
            </div>
          </div>
          <div className="flex items-center">
             <button className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
               Connect Wallet
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
