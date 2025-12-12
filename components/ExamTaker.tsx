
import React, { useState, useEffect, useRef } from 'react';
import { Question, ExamLog, RiskReport } from '../types';
import { MAX_TAB_SWITCHES } from '../constants';

const MOCK_QUESTIONS: Question[] = [
  { id: '1', text: 'Which post-quantum signature scheme is selected by NIST?', options: ['RSA-4096', 'Dilithium', 'ECDSA', 'SHA-3'], correctIndex: 1, expectedTimeSec: 10, type: 'FACTUAL' },
  { id: '2', text: 'In LSB Steganography, changing the least significant bit of a color channel is usually:', options: ['Visible to naked eye', 'Imperceptible', 'Corrupts the file header', 'Increases file size significantly'], correctIndex: 1, expectedTimeSec: 15, type: 'LOGIC' },
];

const ExamTaker: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [logs, setLogs] = useState<ExamLog[]>([]);
  const [finished, setFinished] = useState(false);
  const [riskReport, setRiskReport] = useState<RiskReport | null>(null);

  // Anti-Cheat State
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteEvents, setPasteEvents] = useState(0);
  const questionStartTime = useRef<number>(0);

  useEffect(() => {
    if (!examStarted || finished) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
      }
    };

    const handlePaste = () => {
        setPasteEvents(prev => prev + 1);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("paste", handlePaste);
    };
  }, [examStarted, finished]);

  const startExam = () => {
    setExamStarted(true);
    questionStartTime.current = Date.now();
  };

  const handleAnswer = (index: number) => {
    const now = Date.now();
    const timeSpent = now - questionStartTime.current;
    
    const log: ExamLog = {
      questionId: MOCK_QUESTIONS[currentQIndex].id,
      timeSpentMs: timeSpent,
      tabSwitches: tabSwitches, 
      pasteEvents: pasteEvents,
      timestamp: now
    };

    const newLogs = [...logs, log];
    setLogs(newLogs);

    if (currentQIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      questionStartTime.current = Date.now();
    } else {
      finishExam(newLogs);
    }
  };

  const finishExam = (finalLogs: ExamLog[]) => {
    setFinished(true);
    calculateRisk(finalLogs);
  };

  const calculateRisk = (finalLogs: ExamLog[]) => {
    let score = 0;
    const flags: string[] = [];

    if (tabSwitches > 0) {
      score += tabSwitches * 15;
      flags.push(`Tab switched ${tabSwitches} times`);
    }

    finalLogs.forEach((log, idx) => {
      const q = MOCK_QUESTIONS[idx];
      const timeSec = log.timeSpentMs / 1000;
      if (timeSec < (q.expectedTimeSec * 0.2)) {
        score += 20;
        flags.push(`Answered Q${idx+1} suspiciously fast (${timeSec.toFixed(1)}s vs ${q.expectedTimeSec}s baseline)`);
      }
    });

    if (pasteEvents > 0) {
        score += 10;
        flags.push("Copy/Paste detected");
    }

    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score > 20) level = 'MEDIUM';
    if (score > 50) level = 'HIGH';

    setRiskReport({ score, level, flags });
  };

  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="glass-panel p-8 rounded-2xl text-center border-t-4 border-indigo-500">
          <h2 className="text-3xl font-bold mb-4 text-white">Ghost-Academy Assessment</h2>
          <p className="text-zinc-400 mb-8">Course: Quantum-Resistant Cryptography 101</p>
          
          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg text-left mb-8 mx-auto max-w-lg">
            <h3 className="font-semibold text-yellow-500 mb-2 flex items-center">
               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               Active Proctoring
            </h3>
            <ul className="list-disc list-inside text-sm text-yellow-400/80 space-y-1">
              <li>Tab switching will negatively impact your Risk Score.</li>
              <li>Copy/Paste events are logged.</li>
              <li>Answering faster than humanly possible is flagged.</li>
            </ul>
          </div>
          <button onClick={startExam} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25">
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  if (finished && riskReport) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden">
          {/* Background Glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20 ${riskReport.level === 'HIGH' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          
          <h2 className="text-2xl font-bold mb-6 text-white relative z-10">Assessment Log Complete</h2>
          
          <div className="mb-8 flex justify-center">
             <div className={`relative w-40 h-40 flex items-center justify-center rounded-full border-4 ${riskReport.level === 'HIGH' ? 'border-red-500 text-red-400' : riskReport.level === 'MEDIUM' ? 'border-yellow-500 text-yellow-400' : 'border-emerald-500 text-emerald-400'}`}>
                <div className="text-center">
                  <div className="text-4xl font-extrabold">{riskReport.score}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Risk Score</div>
                </div>
             </div>
          </div>

          <div className="mb-8">
            <h3 className="text-zinc-400 text-sm mb-2">Confidence Level</h3>
            <div className={`text-xl font-bold ${riskReport.level === 'HIGH' ? 'text-red-400' : riskReport.level === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {riskReport.level === 'LOW' ? 'HIGH CONFIDENCE' : 'SUSPICIOUS ACTIVITY'}
            </div>
          </div>

          {riskReport.flags.length > 0 && (
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 text-left mb-8">
              <h4 className="text-red-400 font-semibold mb-2 text-sm">Anomalies Detected:</h4>
              <ul className="list-disc list-inside text-sm text-red-300/70">
                {riskReport.flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          <div className="border-t border-zinc-700 pt-6">
            {riskReport.level === 'HIGH' ? (
              <button disabled className="bg-zinc-700 text-zinc-400 px-6 py-3 rounded-lg cursor-not-allowed font-medium w-full">
                Certificate Blocked (Review Required)
              </button>
            ) : (
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold w-full transition-colors shadow-lg shadow-emerald-500/20">
                Mint Certificate to Blockchain
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = MOCK_QUESTIONS[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex justify-between items-end mb-4 px-2">
        <span className="text-sm font-mono text-zinc-500">Q{currentQIndex + 1} / {MOCK_QUESTIONS.length}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded ${tabSwitches > 0 ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30'}`}>
           Signal: {tabSwitches > 0 ? "INTERRUPTED" : "SECURE"}
        </span>
      </div>
      
      <div className="glass-panel rounded-2xl p-8 relative">
        <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${((currentQIndex + 1) / MOCK_QUESTIONS.length) * 100}%`}}></div>
        
        <h3 className="text-xl font-medium text-white mb-8 leading-relaxed">{question.text}</h3>
        <div className="space-y-4">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full text-left px-6 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500 transition-all text-zinc-200 group"
            >
              <span className="inline-block w-6 text-zinc-500 group-hover:text-indigo-400 font-mono">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamTaker;
