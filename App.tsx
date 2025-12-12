
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Verifier from './components/Verifier';
import ExamTaker from './components/ExamTaker';
import IssuerDashboard from './components/IssuerDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-zinc-100 font-sans selection:bg-indigo-500/30">
        <NavBar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verifier />} />
            <Route path="/exam" element={<ExamTaker />} />
            <Route path="/issuer" element={<IssuerDashboard />} />
          </Routes>
        </main>
        <footer className="border-t border-zinc-800 bg-black/20 py-8 mt-20">
           <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
             &copy; 2024 Ghost-Academy. Built on Polygon / Base. Quantum-Ready.
           </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
