/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Send, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Info, 
  Lock, 
  Check, 
  History, 
  Code,
  GripVertical
} from 'lucide-react';
import Editor from '@monaco-editor/react';

import { Problem, SubmissionResult, UserStats, Verdict } from '../types';
import { evaluateCode } from '../mockJudge';
import { LANGUAGES, STARTER_CODES, Language } from '../languagesData';
import { saveSubmissionToDB } from '../firebaseService';
import { auth } from '../firebase';

interface ProblemSolvingViewProps {
  problem: Problem;
  onBack: () => void;
  stats: UserStats;
  onUpdateStats: (problemId: string, status: 'Solved' | 'Attempted', code: string) => void;
}

interface LocalHistoryItem {
  id: string;
  timestamp: string;
  verdict: Verdict;
  isSubmit: boolean;
  passedCount?: string;
  runtime?: string;
  memory?: string;
}

export default function ProblemSolvingView({ 
  problem, 
  onBack, 
  stats, 
  onUpdateStats 
}: ProblemSolvingViewProps) {
  // Restore last used language or default to sweet setups
  const [selectedLang, setSelectedLang] = useState<Language>(() => {
    const stored = localStorage.getItem(`codejudge_lang_${problem.id}`);
    if (stored) {
      const found = LANGUAGES.find(l => l.id === stored);
      if (found) return found;
    }
    const defaultLangId = problem.id.startsWith('Q') ? 'typescript' : 'python';
    return LANGUAGES.find(l => l.id === defaultLangId) || LANGUAGES[0];
  });

  // Restore saved code for this specific language if exists, otherwise load language-specific starter boilerplate
  const [code, setCode] = useState(() => {
    const key = `codejudge_code_${problem.id}_${selectedLang.id}`;
    const saved = localStorage.getItem(key);
    if (saved) return saved;
    // Fallback to stats last used code if it was python / typescript
    const oldSaved = stats.problems[problem.id]?.lastCode;
    if ((selectedLang.id === 'python' || selectedLang.id === 'typescript') && oldSaved) return oldSaved;
    return STARTER_CODES[problem.id]?.[selectedLang.id] || problem.starterCode;
  });

  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'history'>('description');
  const [activeOutputTab, setActiveOutputTab] = useState<'testcases' | 'result'>('testcases');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [history, setHistory] = useState<LocalHistoryItem[]>([]);

  // Draggable Split Layout Engine
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(41.666667); // start with approx 41.7% (~5/12)
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const newWidthPercent = (currentX / rect.width) * 100;
      
      // Keep inside professional bounds (e.g. 25% min, 75% max)
      if (newWidthPercent >= 25 && newWidthPercent <= 75) {
        setLeftWidth(newWidthPercent);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Smooth layout resizing indicators
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // Synchronize code state when language selection changes
  useEffect(() => {
    const key = `codejudge_code_${problem.id}_${selectedLang.id}`;
    const saved = localStorage.getItem(key);
    setCode(saved || STARTER_CODES[problem.id]?.[selectedLang.id] || '');
    localStorage.setItem(`codejudge_lang_${problem.id}`, selectedLang.id);
  }, [selectedLang, problem.id]);

  // Backup active working progress locally for resilience
  useEffect(() => {
    const key = `codejudge_code_${problem.id}_${selectedLang.id}`;
    localStorage.setItem(key, code);
  }, [code, selectedLang, problem.id]);

  // Restore history from localStorage
  useEffect(() => {
    const key = `codejudge_history_${problem.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        // Safe fallback
      }
    }
    // Also reset selected testcase index when switching problems
    setSelectedCaseIdx(0);
  }, [problem.id]);

  // Handle starter code restore
  const handleReset = () => {
    if (confirm(`Reset editor to default ${selectedLang.name} starter boilerplate? Your current changes will be overwritten.`)) {
      const defaultCode = STARTER_CODES[problem.id]?.[selectedLang.id] || '';
      setCode(defaultCode);
    }
  };

  const handleRunCode = async () => {
    setIsEvaluating(true);
    setActiveOutputTab('result');
    setResult(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem,
          isSubmit: false,
          langId: selectedLang.id
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "API server returned error");
      }

      const evaluation = await response.json() as SubmissionResult;
      evaluation.stdout = (evaluation.stdout || "") + `\n\n[ONLINE CODE JUDGE ACTIVE] Evaluated successfully on ${selectedLang.name} online simulation engine.`;
      
      setResult(evaluation);
      setIsEvaluating(false);

      // Save as attempted
      onUpdateStats(problem.id, 'Attempted', code);

      // Add to history
      const newHistoryItem: LocalHistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        verdict: evaluation.verdict,
        isSubmit: false,
        passedCount: evaluation.passedCount,
        runtime: evaluation.runtime || '25ms',
        memory: evaluation.memory || '8.2MB'
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem(`codejudge_history_${problem.id}`, JSON.stringify(updatedHistory));

    } catch (err) {
      console.warn("Could not evaluate code via the online judge, falling back to local simulation:", err);
      // Local fallback
      const evaluation = evaluateCode(code, problem, false, selectedLang.id);
      evaluation.stdout = (evaluation.stdout || "") + `\n\n[OFFLINE FALLBACK] Evaluated locally on simulated judge (online server was offline or code sandbox key unconfigured).`;
      
      setResult(evaluation);
      setIsEvaluating(false);

      onUpdateStats(problem.id, 'Attempted', code);

      const newHistoryItem: LocalHistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        verdict: evaluation.verdict,
        isSubmit: false,
        passedCount: evaluation.passedCount,
        runtime: evaluation.runtime || '15ms',
        memory: evaluation.memory || '8.2MB'
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem(`codejudge_history_${problem.id}`, JSON.stringify(updatedHistory));
    }
  };

  const handleSubmitCode = async () => {
    setIsEvaluating(true);
    setActiveOutputTab('result');
    setResult(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem,
          isSubmit: true,
          langId: selectedLang.id
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "API server returned error");
      }

      const evaluation = await response.json() as SubmissionResult;
      evaluation.stdout = (evaluation.stdout || "") + `\n\n[ONLINE CODE JUDGE ACTIVE] Evaluated successfully on ${selectedLang.name} online simulation engine.`;

      setResult(evaluation);
      setIsEvaluating(false);

      // Determine status from verification
      const status = evaluation.verdict === 'Accepted' ? 'Solved' : 'Attempted';
      onUpdateStats(problem.id, status, code);

      const subId = Math.random().toString(36).substring(7);

      // Record in Cloud database if authenticated
      if (auth.currentUser) {
        saveSubmissionToDB(subId, {
          userId: auth.currentUser.uid,
          problemId: problem.id,
          langId: selectedLang.id,
          code: code,
          verdict: evaluation.verdict,
          passedCount: evaluation.passedCount || '',
          runtime: evaluation.runtime || '32ms',
          memory: evaluation.memory || '8.4MB'
        }).catch((err) => {
          console.warn('Could not save submission log to Cloud Firestore:', err);
        });
      }

      // Add to history
      const newHistoryItem: LocalHistoryItem = {
        id: subId,
        timestamp: new Date().toLocaleTimeString(),
        verdict: evaluation.verdict,
        isSubmit: true,
        passedCount: evaluation.passedCount,
        runtime: evaluation.runtime || '32ms',
        memory: evaluation.memory || '8.4MB'
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem(`codejudge_history_${problem.id}`, JSON.stringify(updatedHistory));

    } catch (err) {
      console.warn("Could not submit code via the online judge, falling back to local simulation:", err);
      // Local fallback
      const evaluation = evaluateCode(code, problem, true, selectedLang.id);
      evaluation.stdout = (evaluation.stdout || "") + `\n\n[OFFLINE FALLBACK] Evaluated locally on simulated judge (online server was offline or code sandbox key unconfigured).`;

      setResult(evaluation);
      setIsEvaluating(false);

      const status = evaluation.verdict === 'Accepted' ? 'Solved' : 'Attempted';
      onUpdateStats(problem.id, status, code);

      const subId = Math.random().toString(36).substring(7);

      if (auth.currentUser) {
        saveSubmissionToDB(subId, {
          userId: auth.currentUser.uid,
          problemId: problem.id,
          langId: selectedLang.id,
          code: code,
          verdict: evaluation.verdict,
          passedCount: evaluation.passedCount || '',
          runtime: evaluation.runtime || '25ms',
          memory: evaluation.memory || '8.3MB'
        }).catch((err) => {
          console.warn('Could not save submission log to Cloud Firestore:', err);
        });
      }

      // Add to history
      const newHistoryItem: LocalHistoryItem = {
        id: subId,
        timestamp: new Date().toLocaleTimeString(),
        verdict: evaluation.verdict,
        isSubmit: true,
        passedCount: evaluation.passedCount,
        runtime: evaluation.runtime || '25ms',
        memory: evaluation.memory || '8.3MB'
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem(`codejudge_history_${problem.id}`, JSON.stringify(updatedHistory));
    }
  };

  const getVerdictStyle = (v: Verdict) => {
    switch (v) {
      case 'Accepted':
        return 'text-violet-400 border-violet-500/20 bg-violet-500/10';
      case 'Wrong Answer':
        return 'text-red-400 border-red-500/20 bg-red-500/10';
      case 'Runtime Error':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'Compilation Error':
        return 'text-zinc-350 border-zinc-500/20 bg-zinc-900';
      default:
        return 'text-zinc-400 border-zinc-800 bg-zinc-950';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Top micro-bar */}
      <div className="flex h-11 items-center justify-between border-b border-violet-950 bg-zinc-900/40 px-4 py-1 shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="group flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all focus:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Problem Catalogue</span>
          </button>
          <div className="h-4 w-px bg-violet-950/40" />
          <span className="font-mono text-xs text-zinc-500">Language:</span>
          <div className="relative">
            <select
              value={selectedLang.id}
              onChange={(e) => {
                const found = LANGUAGES.find(l => l.id === e.target.value);
                if (found) setSelectedLang(found);
              }}
              className="font-mono text-[11px] font-bold text-violet-300 bg-zinc-900 border border-violet-500/20 hover:border-violet-500/50 rounded-lg px-2.5 py-0.5 pr-6 cursor-pointer focus:outline-none appearance-none transition-all duration-200 select-none shadow-[0_0_10px_rgba(139,92,246,0.05)]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-zinc-950 text-zinc-300 font-mono text-xs">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -track-y-1/2 pointer-events-none text-violet-400 select-none text-[8px] transform -translate-y-1/2">
              ▼
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {stats.problems[problem.id]?.status === 'Solved' && (
            <span className="inline-flex items-center space-x-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-black text-violet-400 border border-violet-500/20 uppercase tracking-wide">
              <Check className="h-3 w-3" />
              <span>Solved</span>
            </span>
          )}

          <button
            onClick={handleReset}
            title="Reset to original boilerplate"
            className="flex items-center space-x-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-850 hover:text-white transition-all duration-200 border-0 cursor-pointer focus:outline-none"
          >
            <RefreshCw className="h-3 w-3 transition-transform duration-300 hover:rotate-90 text-violet-400" />
            <span>Reset Boilerplate</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div 
        ref={containerRef}
        style={{ '--left-panel-width': `${leftWidth}%` } as React.CSSProperties}
        className="flex flex-1 flex-col md:flex-row overflow-hidden relative"
      >
        {/* Left column: Problem Statement & History */}
        <div className="w-full md:w-[var(--left-panel-width)] border-b md:border-b-0 flex flex-col h-1/2 md:h-full bg-zinc-950 overflow-hidden">
          {/* Header tabs */}
          <div className="flex border-b border-violet-955/30 bg-zinc-900/10 shrink-0 select-none">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'description'
                  ? 'border-violet-500 text-white bg-zinc-900/10'
                  : 'border-transparent text-zinc-550 hover:text-zinc-355'
              }`}
            >
              <Info className="h-3.5 w-3.5 text-zinc-455" />
              <span>1. Specification</span>
            </button>
            <button
              onClick={() => setActiveLeftTab('history')}
              className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'history'
                  ? 'border-violet-500 text-white bg-zinc-900/10'
                  : 'border-transparent text-zinc-550 hover:text-zinc-355'
              }`}
            >
              <History className="h-3.5 w-3.5 text-zinc-455" />
              <span>2. Submission History ({history.length})</span>
            </button>
          </div>

          {/* Tab contents */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 select-text">
            {activeLeftTab === 'description' ? (
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-violet-400 border border-violet-500/25">
                      {problem.difficulty}
                    </span>
                    <span className="font-mono text-zinc-550 text-xs">ID: {problem.id}</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">{problem.title}</h1>
                </div>

                {/* Description */}
                <div className="text-sm text-zinc-300 leading-relaxed space-y-4">
                  <p className="whitespace-pre-wrap">{problem.description}</p>
                </div>

                {/* Formats Container */}
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="rounded-xl bg-violet-950/20 backdrop-blur-sm border border-violet-500/25 shadow-[0_0_15px_rgba(139,92,246,0.12)] p-4 space-y-2 hover:border-violet-500/40 transition-all duration-300">
                    <h3 className="font-mono text-xs font-bold text-violet-300 uppercase tracking-wider">Input Parameter Signature</h3>
                    <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">{problem.inputFormat}</p>
                  </div>
                  <div className="rounded-xl bg-violet-950/20 backdrop-blur-sm border border-violet-500/25 shadow-[0_0_15px_rgba(139,92,246,0.12)] p-4 space-y-2 hover:border-violet-500/40 transition-all duration-300">
                    <h3 className="font-mono text-xs font-bold text-violet-300 uppercase tracking-wider">Returned Output Specification</h3>
                    <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">{problem.outputFormat}</p>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">Problem Constraints</h3>
                  <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300 font-mono text-[10.5px]">
                          {constraint}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Local Interpretation hints */}
                <div className="rounded-xl bg-gradient-to-r from-violet-950/30 to-purple-950/30 backdrop-blur-md border border-violet-550/40 shadow-[0_0_25px_rgba(139,92,246,0.22)] p-4.5 space-y-2.5">
                  <div className="flex items-center text-violet-400 space-x-1.5">
                    <Terminal className="h-4 w-4" />
                    <span className="text-xs font-bold font-mono">INTELLIGENT PATTERN VERIFIER</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal font-sans">
                    This playground validates solutions via logical structural pattern analyzers.
                    {problem.id === 'two-sum' && (
                      <span> Code must construct structural variables using a <b>dictionary or seen map</b> to track complements, query <b>target</b> variables, and use <b>return</b>.</span>
                    )}
                    {problem.id === 'palindrome-number' && (
                      <span> Code must wrap the input as a string <b>str(x)</b>, inverse it using reverse checks or slices <b>[::-1]</b>, and <b>return</b>.</span>
                    )}
                    {problem.id === 'reverse-string' && (
                      <span> Code must perform string inversion sequences using a string slice <b>[::-1]</b> or string <b>reverse</b> routines, and <b>return</b>.</span>
                    )}
                    {problem.id === 'maximum-number' && (
                      <span> Code must reference standard Python list bounds checking or <b>max(...)</b>, and <b>return</b>.</span>
                    )}
                    {problem.id === 'count-vowels' && (
                      <span> Code must check string keys for vowel indices matching <b>aeiou</b> (either lowercase or upper) in a lookup table or count cycle, and <b>return</b>.</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              // Submission Logs History View
              <div className="space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Past Work History</h3>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-550">
                    <History className="h-8 w-8 text-zinc-800 mb-2" />
                    <p className="text-xs">No local evaluations recorded for this challenge yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div 
                        key={item.id}
                        className="rounded-lg border border-violet-950/45 bg-violet-955/5 p-3.5 flex items-center justify-between gap-4 hover:border-violet-500/25 hover:shadow-[0_0_12px_rgba(139,92,246,0.06)] transition-all duration-300"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getVerdictStyle(item.verdict)}`}>
                              {item.verdict}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">{item.timestamp}</span>
                          </div>
                          <div className="text-xs text-zinc-450">
                            {item.isSubmit ? 'Submit Sandbox Evaluation' : 'Run Code Test'}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px] text-zinc-400 space-y-0.5">
                          {item.passedCount && <div>Passed: {item.passedCount}</div>}
                          {item.runtime && item.memory && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {item.runtime} | {item.memory}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Separator Divider */}
        <div
          onMouseDown={startDragging}
          className={`hidden md:flex items-center justify-center w-2.5 px-0.5 h-full cursor-col-resize select-none transition-all duration-200 shrink-0 group relative z-15 ${
            isDragging ? 'bg-violet-500/10' : 'hover:bg-violet-500/5'
          }`}
        >
          {/* Inner vertical dividing line */}
          <div className={`w-[1px] h-full transition-all duration-300 ${
            isDragging ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]' : 'bg-violet-950/50 group-hover:bg-violet-500/40'
          }`} />
          
          {/* Accent Drag Handle */}
          <div className={`absolute p-1.5 rounded-lg border bg-zinc-950 transition-all duration-300 pointer-events-none transform ${
            isDragging 
              ? 'border-violet-500 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-105' 
              : 'border-violet-950/60 text-zinc-500 group-hover:border-violet-550/40 group-hover:text-violet-400 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] group-hover:scale-102'
          }`}>
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Right column: Editor + Output Console */}
        <div className="w-full md:w-[calc(100%-var(--left-panel-width))] flex flex-col h-1/2 md:h-full bg-zinc-950 overflow-hidden">
          {/* Editor Workspace Block */}
          <div className="flex-1 relative min-h-[150px] border-b border-violet-950 flex flex-col overflow-hidden">
            <div className="h-8 bg-zinc-900 flex items-center justify-between px-4 border-b border-violet-955/40 shrink-0 select-none">
              <span className="font-mono text-[11px] text-zinc-400 flex items-center space-x-1.5">
                <Code className="h-3 w-3 text-violet-400" />
                <span>solution.{selectedLang.ext}</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">{selectedLang.engine}</span>
            </div>

            <div className="flex-1 relative bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={selectedLang.monacoLang}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                loading={
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 space-y-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-violet-400" />
                    <span className="font-mono text-xs">Booting Dynamic Compiler Simulation...</span>
                  </div>
                }
                options={{
                  fontFamily: '"Fira Code", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: 13,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  cursorBlinking: 'smooth',
                  renderWhitespace: 'none',
                  padding: { top: 12, bottom: 12 }
                }}
              />
            </div>
          </div>

          {/* Bottom Control Bar and Console Panel Combo */}
          <div className="h-1/2 md:h-[280px] bg-zinc-950 flex flex-col shrink-0 overflow-hidden">
            {/* Console Control Tabs */}
            <div className="h-10 border-b border-violet-955/35 bg-zinc-950 flex items-center justify-between px-4 shrink-0 select-none">
              <div className="flex bg-[#13111c] p-0.5 rounded-lg border border-violet-500/15">
                <button
                  onClick={() => setActiveOutputTab('testcases')}
                  className={`px-3 py-1 text-xs rounded-md font-mono font-medium transition-all cursor-pointer ${
                    activeOutputTab === 'testcases'
                      ? 'bg-violet-950/70 border border-violet-500/25 text-violet-300 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Public Test Cases
                </button>
                <button
                  onClick={() => setActiveOutputTab('result')}
                  className={`px-3 py-1 text-xs rounded-md font-mono font-medium relative transition-all cursor-pointer ${
                    activeOutputTab === 'result'
                      ? 'bg-violet-950/70 border border-violet-500/25 text-violet-300 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span>Evaluation Logs</span>
                  {result && (
                    <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
                      result.verdict === 'Accepted' ? 'bg-violet-500' : 'bg-red-550'
                    }`} />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunCode}
                  disabled={isEvaluating}
                  className="inline-flex items-center space-x-1.5 rounded-lg border border-violet-550/30 bg-[#13111c] px-3.5 py-1.5 text-xs font-mono font-semibold text-zinc-300 shadow hover:bg-violet-950/20 hover:text-white hover:border-violet-500/45 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Run Code</span>
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isEvaluating}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-violet-650 hover:bg-violet-600 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] px-4 py-1.5 text-xs font-mono font-bold text-white shadow transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Code</span>
                </button>
              </div>
            </div>

            {/* Panel Tab Content Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {activeOutputTab === 'testcases' ? (
                // Compact interactive test cases layout (reduced UI height and noise)
                <div className="space-y-3">
                  {/* Case Switcher header line */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-900 select-none">
                    <div className="flex items-center space-x-1.5">
                      {problem.publicTestCases.map((tc, idx) => (
                        <button
                          key={tc.id}
                          onClick={() => setSelectedCaseIdx(idx)}
                          className={`px-3 py-1 text-xs rounded-lg font-mono font-medium transition-all cursor-pointer focus:outline-none ${
                            selectedCaseIdx === idx
                              ? 'bg-violet-500/20 text-violet-300'
                              : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-900/45 px-2 py-0.5 rounded select-none">Public</span>
                  </div>

                  {/* Clean side-by-side minimalist parameters with glowing colorcard styles and no creepy borders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-zinc-900/70 backdrop-blur-md shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6)] p-4 hover:bg-zinc-900/80 transition-all duration-300 border-0">
                      <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2 select-none">Input params</span>
                      <pre className="text-zinc-200 text-xs font-mono whitespace-pre-wrap select-text font-medium bg-transparent">
                        {problem.publicTestCases[selectedCaseIdx].input}
                      </pre>
                    </div>
                    <div className="rounded-xl bg-violet-950/25 backdrop-blur-md shadow-[0_16px_36px_-6px_rgba(139,92,246,0.18)] p-4 hover:bg-violet-950/35 transition-all duration-300 border-0">
                      <span className="block text-[10px] text-violet-400 font-bold uppercase tracking-wider mb-2 select-none">Expected Return</span>
                      <pre className="text-violet-400 text-xs font-mono whitespace-pre-wrap select-text font-semibold bg-transparent">
                        {problem.publicTestCases[selectedCaseIdx].expected}
                      </pre>
                    </div>
                  </div>

                  {/* Unified low-profile footer label instead of massive cards */}
                  <div className="flex items-center space-x-1.5 text-violet-400/80 text-[10.5px] select-none pt-1">
                    <Info className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                    <span>Interactive validator. Check logic details, targets, indices, then submit code.</span>
                  </div>
                </div>
              ) : (
                // Evaluation result tab contents
                <div className="h-full">
                  {isEvaluating ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 py-6 text-zinc-400 select-none">
                      <RefreshCw className="h-5 w-5 animate-spin text-violet-400 shrink-0" />
                      <div className="text-center space-y-1">
                        <span className="font-mono text-xs font-medium text-zinc-300">Evaluating local pattern validation...</span>
                        <p className="font-sans text-[11px] text-zinc-500">Checking syntactical definitions, return targets, structure complements, and loop indices.</p>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      {/* Metric Results Badge Panel */}
                      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-850 pb-3">
                        <div className={`rounded-lg px-3 py-1 font-mono uppercase font-black tracking-wide border text-center ${getVerdictStyle(result.verdict)}`}>
                          {result.verdict}
                        </div>
                        
                        {result.passedCount && (
                          <div className="rounded-lg bg-violet-955/15 border border-violet-500/15 px-3 py-1 font-mono text-zinc-300 select-none">
                            Passed: <span className="text-white font-bold">{result.passedCount}</span>
                          </div>
                        )}

                        {result.runtime && (
                          <div className="rounded-lg bg-violet-955/15 border border-violet-500/15 px-3 py-1 font-mono text-zinc-300 select-none">
                            Runtime: <span className="text-violet-400 font-bold">{result.runtime}</span>
                          </div>
                        )}

                        {result.memory && (
                          <div className="rounded-lg bg-violet-955/15 border border-violet-500/15 px-3 py-1 font-mono text-zinc-300 select-none">
                            Memory: <span className="text-blue-450 font-bold">{result.memory}</span>
                          </div>
                        )}
                      </div>

                      {/* Output Console Logs */}
                      {result.stdout && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block select-none">Standard Output (stdout):</span>
                          <pre className="bg-zinc-905 text-zinc-300 p-3 rounded-xl border-0 shadow-md max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                            {result.stdout}
                          </pre>
                        </div>
                      )}

                      {/* Error or compilation stacktrace hidden to conform with 'dont show where the error is' instruction */}

                      {/* Run Code Public Fail Details hidden to conform with 'dont show where the error is' instruction */}

                      {/* If accepted show next action button or review */}
                      {result.verdict === 'Accepted' && (
                        <div className="rounded-xl bg-violet-500/10 p-4 shadow-lg shadow-violet-955/5 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans border-0">
                          <div className="flex items-center space-x-2 text-violet-400">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <div>
                              <span className="block text-xs font-bold leading-normal">
                                Solutions Approved Successfully!
                              </span>
                              <span className="block text-[11px] text-zinc-400 mt-0.5 leading-normal">
                                Your Python code pattern successfully matches and passes all evaluation test criteria!
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={onBack}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-violet-605 px-4 py-1.5 text-xs font-semibold text-white tracking-wide hover:bg-violet-550 transition-colors cursor-pointer border-0 focus:outline-none"
                          >
                            Browse Next Challenge
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Initial result panel instructions
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-6 select-none text-center">
                      <Terminal className="h-6 w-6 text-zinc-800 mb-2" />
                      <p className="text-xs font-mono">Output terminal idle.</p>
                      <p className="text-[10px] text-zinc-600 mt-1 font-sans font-medium">Trigger "Run Code" or "Submit Code" to feed active python patterns into local testing.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
