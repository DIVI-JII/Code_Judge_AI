/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Code, Sparkles, Play, Target, Database, Swords, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { UserStats } from '../types';

interface HomeProps {
  stats: UserStats;
  onStartPractice: () => void;
}

export default function Home({ stats, onStartPractice }: HomeProps) {
  const solvedCount = Object.values(stats.problems).filter((p: any) => p.status === 'Solved').length;
  const attemptedCount = Object.values(stats.problems).filter((p: any) => p.status === 'Attempted').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-zinc-950 flex flex-col justify-between overflow-hidden">
      {/* Dynamic Background Visual Accents */}
      <div className="absolute top-[-10%] left-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-1/4 right-[15%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none animate-pulse duration-[12s]" />

      {/* Hero Content Wrapper */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 py-12 md:py-20 text-center space-y-8"
      >
        {/* Feature Capsule Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center space-x-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 px-3 py-1.5 text-xs text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:border-violet-400/40 transition-colors duration-300 select-none"
        >
          <Sparkles className="h-3 w-3 animate-spin duration-[4s]" />
          <span className="font-mono font-bold tracking-wider uppercase text-[10px]">LOCAL ALGORITHMIC WORKSPACE</span>
        </motion.div>

        {/* Brand Display Typography */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white space-y-2 select-text leading-tight">
            <span className="block">CodeJudge <span className="relative inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">AI</span><span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-gradient-to-r from-violet-500/10 via-violet-500/50 to-indigo-500/10 rounded-full" /></span></span>
          </h1>
          <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Refine your coding intelligence and standard algorithmic designs with interactive compiler simulation, live output consoles, and automated pattern verifications.
          </p>
        </motion.div>

        {/* Dashboard Stat Counters */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md w-full pt-4 relative"
        >
          {/* Solved Metric Card */}
          <div className="group relative rounded-xl border border-violet-500/20 bg-violet-950/15 shadow-[0_4px_25px_rgba(139,92,246,0.05)] p-4 backdrop-blur-md hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300">
            <div className="absolute top-2 right-2 text-violet-400 opacity-30 group-hover:opacity-100 transition-opacity"><Target className="h-3 w-3 animate-pulse" /></div>
            <span className="block font-mono text-2xl md:text-3xl font-black text-white">{solvedCount}/5</span>
            <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono tracking-wider">Solved Counts</span>
          </div>

          {/* Attempted Metric Card */}
          <div className="group relative rounded-xl border border-violet-500/20 bg-violet-950/15 shadow-[0_4px_25px_rgba(139,92,246,0.05)] p-4 backdrop-blur-md hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300">
            <div className="absolute top-2 right-2 text-indigo-400 opacity-30 group-hover:opacity-100 transition-opacity"><Terminal className="h-3 w-3" /></div>
            <span className="block font-mono text-2xl md:text-3xl font-black text-violet-300">{attemptedCount}</span>
            <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono tracking-wider">Attempted</span>
          </div>

          {/* Core Level Badge Card */}
          <div className="group col-span-2 sm:col-span-1 relative rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 backdrop-blur-md shadow-[0_4px_25px_rgba(168,85,247,0.08)] text-center hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300">
            <div className="absolute top-2 right-2 text-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"><Zap className="h-3 w-3 fill-amber-400" /></div>
            <span className="block font-mono text-2xl md:text-3xl font-black text-purple-200">100%</span>
            <span className="text-[10px] text-purple-400 uppercase font-bold font-mono tracking-wider">Local Sandboxed</span>
          </div>
        </motion.div>

        {/* Navigation Call-to-action */}
        <motion.div variants={itemVariants} className="pt-4 shrink-0">
          <button
            onClick={onStartPractice}
            className="group relative inline-flex items-center space-x-3.5 rounded-xl bg-violet-600 hover:bg-violet-550 px-8 py-4.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(139,92,246,0.25)] hover:shadow-[0_0_35px_rgba(139,92,246,0.45)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer focus:outline-none"
          >
            <Play className="h-4 w-4 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>Launch Code Workspace</span>
          </button>
        </motion.div>

        {/* Features Bento Grid */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full pt-12 text-left"
        >
          {/* Card 1 */}
          <div className="group relative rounded-xl border border-violet-500/10 bg-zinc-900/25 p-6 space-y-3.5 hover:border-violet-500/35 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)] hover:bg-zinc-900/40 transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-105 group-hover:bg-violet-500/20 transition-all duration-300">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base font-sans select-none tracking-tight">Monaco Python Workspace</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Experience robust multi-cursors, bracket coloring, custom margins, and code completion snippets. Powered by the industry-standard developer engine.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-xl border border-violet-500/10 bg-zinc-900/25 p-6 space-y-3.5 hover:border-indigo-500/35 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] hover:bg-zinc-900/40 transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all duration-300">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base font-sans select-none tracking-tight">Encrypted Progress Sync</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Saves coding efforts, historical diagnostic outcomes, editor contents, and completed state statistics inside secure client storage instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-xl border border-violet-500/10 bg-zinc-900/25 p-6 space-y-3.5 hover:border-pink-500/35 hover:shadow-[0_8px_30px_rgba(236,72,153,0.08)] hover:bg-zinc-900/40 transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-105 group-hover:bg-pink-500/20 transition-all duration-300">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base font-sans select-none tracking-tight">Intelligent Code Asserter</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Validates algorithmic structures, indexing parameters, matching loops, and data structures locally with clear validation status results.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Elegant Footer component */}
      <footer className="py-6 border-t border-violet-950/80 text-zinc-600 text-center text-xs self-center font-sans tracking-wide">
        <span className="font-mono text-violet-400/70 font-semibold select-none">CodeJudge AI</span> &bull; Sandbox Practicing Hub &bull; Local Persistent Session Connected
      </footer>
    </div>
  );
}

