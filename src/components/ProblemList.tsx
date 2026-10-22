/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Circle, 
  Code2, 
  Sparkles, 
  Filter 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Problem, UserStats } from '../types';

interface ProblemListProps {
  problems: Problem[];
  stats: UserStats;
  onSelectProblem: (id: string) => void;
  onNavigate: (view: 'home' | 'list' | 'solve') => void;
}

export default function ProblemList({ 
  problems, 
  stats, 
  onSelectProblem, 
  onNavigate
}: ProblemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Attempted' | 'Unattempted'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  
  // Acceptance rates mapping for realistic touch
  const acceptanceRates: Record<string, string> = {
    'two-sum': '50.1%',
    'palindrome-number': '53.8%',
    'reverse-string': '75.3%',
    'maximum-number': '82.0%',
    'count-vowels': '78.5%',
  };

  const getStatus = (problemId: string) => {
    return stats.problems[problemId]?.status || 'Unattempted';
  };

  const filteredProblems = problems.filter(problem => {
    // Search
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const status = getStatus(problem.id);
    let matchesStatus = true;
    if (statusFilter === 'Solved') matchesStatus = (status === 'Solved');
    else if (statusFilter === 'Attempted') matchesStatus = (status === 'Attempted');
    else if (statusFilter === 'Unattempted') matchesStatus = (status === 'Unattempted');

    // Difficulty filter
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05 } 
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 120, damping: 15 } 
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Banner Card */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8 overflow-hidden rounded-2xl border border-violet-900/30 bg-gradient-to-r from-zinc-950 via-violet-950/10 to-zinc-950 p-6 sm:p-8 shadow-[0_4px_30px_rgba(139,92,246,0.05)]"
      >
        <div className="absolute top-0 right-0 h-48 w-48 -mr-12 -mt-12 rounded-full bg-violet-500/5 blur-3xl text-violet-400" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -ml-12 -mb-12 rounded-full bg-indigo-500/5 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-xs text-violet-400">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span className="font-semibold text-[11px] tracking-wide uppercase">Local Validation Sandbox Open</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Challenge Catalog
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              Enhance algorithmic logic constraints using clean Python syntax. Learn and implement core data structures, track indices, and satisfy validation criteria in real-time.
            </p>
          </div>
          
          <div className="flex shrink-0 gap-4">
            <div className="rounded-xl border border-violet-950 bg-zinc-950/80 p-4 text-center min-w-[100px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="block text-2xl font-black font-mono text-violet-400">
                {Object.values(stats.problems).filter((p: any) => p.status === 'Solved').length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Solved</span>
            </div>
            <div className="rounded-xl border border-violet-950 bg-zinc-950/80 p-4 text-center min-w-[100px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="block text-2xl font-black font-mono text-white">
                {problems.length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Total</span>
            </div>
          </div>
        </div>
      </motion.div>



      {/* Filters and Controls */}
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between bg-zinc-90 w-full rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-violet-955 bg-zinc-900/40 py-2.5 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-all focus:border-violet-500/50 focus:bg-zinc-900/80 focus:ring-1 focus:ring-violet-500/20 focus:outline-none"
          />
        </div>

        {/* Filters Grouping */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center select-none">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold mr-1 font-sans uppercase tracking-wider">
              <Filter className="h-3.5 w-3.5 text-violet-400" />
              Status:
            </span>
            {(['All', 'Solved', 'Attempted', 'Unattempted'] as const).map((filter) => {
              const count = filter === 'All' 
                ? problems.length 
                : filter === 'Solved' 
                  ? Object.values(stats.problems).filter((p: any) => p.status === 'Solved').length
                  : filter === 'Attempted'
                    ? Object.values(stats.problems).filter((p: any) => p.status === 'Attempted').length
                    : problems.length - Object.values(stats.problems).filter((p: any) => p.status === 'Solved' || p.status === 'Attempted').length;

              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                    statusFilter === filter
                      ? 'border-violet-500/20 bg-violet-500/15 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'border-violet-955/40 bg-zinc-900/20 text-zinc-400 hover:border-violet-550/30 hover:bg-zinc-900/45 hover:text-white'
                  }`}
                >
                  <span>{filter}</span>
                  <span className={`inline-block font-mono px-1.5 py-0.2 text-[10px] font-bold rounded ${
                    statusFilter === filter ? 'bg-violet-500/25 text-violet-300' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block h-6 w-px bg-violet-950/30" />

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold mr-1 font-sans uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
              Difficulty:
            </span>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
              const count = diff === 'All' 
                ? problems.length 
                : problems.filter(p => p.difficulty === diff).length;

              const labelStyles: Record<string, string> = {
                All: 'text-zinc-400',
                Easy: 'text-emerald-400',
                Medium: 'text-amber-400',
                Hard: 'text-rose-450'
              };

              return (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                    difficultyFilter === diff
                      ? 'border-violet-500/25 bg-violet-500/15 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'border-violet-955/40 bg-zinc-900/20 text-zinc-400 hover:border-violet-550/30 hover:bg-zinc-900/45 hover:text-white'
                  }`}
                >
                  <span className={difficultyFilter === diff ? '' : labelStyles[diff]}>{diff}</span>
                  <span className={`inline-block font-mono px-1.5 py-0.2 text-[10px] font-bold rounded ${
                    difficultyFilter === diff ? 'bg-violet-500/25 text-violet-300' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problems List Table Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden rounded-xl border border-violet-950/60 bg-zinc-950/45 backdrop-blur-sm shadow-md"
      >
        {filteredProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 text-zinc-400">
            <Code2 className="h-10 w-10 text-zinc-800 mb-3 animate-pulse" />
            <p className="text-zinc-400 text-sm font-medium">No challenges meet your search filter criteria.</p>
            <p className="text-xs text-zinc-650 mt-1">Try adjusting the search query or status toggle buttons.</p>
          </div>
        ) : (
          <div className="divide-y divide-violet-950/20">
            {/* Table Head */}
            <div className="hidden md:flex items-center px-6 py-3 bg-zinc-900/25 text-[11px] font-mono font-black text-zinc-500 uppercase tracking-widest select-none border-b border-violet-950/30">
              <span className="w-12 text-center">Status</span>
              <span className="flex-1 px-4">Title</span>
              <span className="w-32 text-center">Difficulty</span>
              <span className="w-32 text-center font-mono">Acceptance</span>
              <span className="w-28 text-right">Action</span>
            </div>

            {/* List Body */}
            {filteredProblems.map((problem) => {
              const status = getStatus(problem.id);
              const acceptance = acceptanceRates[problem.id] || '75.0%';

               return (
                <motion.div 
                  variants={itemVariants}
                  key={problem.id}
                  className="group flex flex-col md:flex-row md:items-center px-4 py-4 md:px-6 transition-all duration-300 hover:bg-violet-950/5 select-none"
                >
                  {/* Status column */}
                  <div className="flex items-center justify-between md:justify-center md:w-12 py-1 md:py-0">
                    <span className="md:hidden text-xs text-zinc-500 font-mono">Status:</span>
                    {status === 'Solved' ? (
                      <CheckCircle2 className="h-5 w-5 text-violet-400 fill-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]" title="Approved Status" />
                    ) : status === 'Attempted' ? (
                      <Circle className="h-5 w-5 text-amber-500 fill-amber-500/10 animate-pulse animate-duration-1000" title="Evaluation Ongoing" />
                    ) : (
                      <Circle className="h-5 w-5 text-zinc-800" title="Not Started" />
                    )}
                  </div>

                  {/* Title & Short Details */}
                  <div className="flex-1 py-1.5 md:py-0 px-0 md:px-4">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 
                        onClick={() => onSelectProblem(problem.id)}
                        className="text-base font-bold text-white group-hover:text-violet-400 cursor-pointer transition-colors duration-200 select-text"
                      >
                        {problem.title}
                      </h3>
                    </div>
                    {/* Truncated Description */}
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1 max-w-3xl font-sans text-zinc-400/90 leading-relaxed font-normal select-text">
                      {problem.description}
                    </p>
                  </div>

                  {/* Mobile Row split for stats */}
                  <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-zinc-900 md:border-0 md:mt-0 md:pt-0">
                    {/* Difficulty */}
                    <div className="md:w-32 md:text-center shrink-0">
                      <span className="md:hidden text-[10px] text-zinc-500 uppercase mr-1.5 font-mono">Difficulty:</span>
                      <span className="inline-flex rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-300 border border-violet-500/15">
                        {problem.difficulty}
                      </span>
                    </div>

                    {/* Acceptance */}
                    <div className="md:w-32 md:text-center text-xs font-mono text-zinc-400 font-semibold">
                      <span className="md:hidden text-[10px] text-zinc-500 uppercase mr-1.5 font-mono">Acceptance:</span>
                      {acceptance}
                    </div>

                    {/* Button */}
                    <div className="md:w-28 text-right grow md:grow-0">
                      <button
                        onClick={() => onSelectProblem(problem.id)}
                        className={`w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-lg font-bold transition-all duration-300 cursor-pointer focus:outline-none ${
                          status === 'Solved'
                            ? 'bg-zinc-900 border border-violet-500/10 text-violet-300 hover:bg-violet-950/20 hover:border-violet-500/25'
                            : 'bg-violet-650 text-white hover:bg-violet-605 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                        }`}
                      >
                        <span>{status === 'Solved' ? 'Review Code' : 'Challenge'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Useful tips card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="rounded-xl border border-violet-500/10 bg-zinc-900/10 p-5 space-y-2.5 hover:border-violet-500/30 hover:shadow-[0_4px_25px_rgba(139,92,246,0.05)] transition-all duration-300">
          <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-1.5 select-none uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <span>INTELLIGENT SYSTEM MATRIX</span>
          </h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-sans">
            Since code runs locally inside a mock filter engine, tests look for logical Python structural components to guarantee correctness. For example, for <strong>Two Sum</strong>, write code that contains variable declarations using a <strong>dictionary</strong> mapping, checks <strong>target</strong> calculations, and has an exact <strong>return</strong> statement. Check details on each problem workspace!
          </p>
        </div>

        <div className="rounded-xl border border-violet-500/10 bg-zinc-900/10 p-5 space-y-2.5 hover:border-violet-500/30 hover:shadow-[0_4px_25px_rgba(139,92,246,0.05)] transition-all duration-300">
          <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-1.5 select-none uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
            <span>SANDBOX COMPILATION RULES</span>
          </h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-sans">
            Use the <strong>Run Code</strong> button to test your solution's current outputs against the public test suites. When you are fully confident with your code, click <strong>Submit Code</strong> to evaluate your final implementation metrics!
          </p>
        </div>
      </div>
    </div>
  );
}
