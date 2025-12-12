
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="relative isolate pt-14">
      {/* Background Gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
      </div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl neon-text">
              Credentials Unseen. <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Verified Forever.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              The world's first Quantum-Ready certification platform using steganographic watermarking. 
              Issue tamper-evident degrees that live on the blockchain and inside the image itself.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/exam" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 shadow-indigo-500/20">
                Start Learning
              </Link>
              <Link to="/verify" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
                Verify a Certificate <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-zinc-900/50 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4 glass-panel animate-float">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 text-left">
                
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="text-white font-semibold text-lg">Quantum Secured</h3>
                  <p className="text-zinc-400 text-sm">Protected by Post-Quantum Cryptography standards (Dilithium/Falcon ready) to future-proof your achievements.</p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center border border-purple-500/30">
                     <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </div>
                  <h3 className="text-white font-semibold text-lg">Invisible Watermark</h3>
                  <p className="text-zinc-400 text-sm">Metadata is embedded directly into the pixels using LSB Steganography. No separate file needed to verify.</p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center border border-emerald-500/30">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-white font-semibold text-lg">AI Proctoring</h3>
                  <p className="text-zinc-400 text-sm">Behavioral heuristics analyze exam sessions for anomalies, embedding a risk score into the credential.</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
