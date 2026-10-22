/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, RefreshCw, Award, LogIn, LogOut, CheckCircle2, Loader2 } from 'lucide-react';
import { UserStats } from '../types';

interface NavbarProps {
  stats: UserStats;
  currentView: 'home' | 'list' | 'solve' | 'creator';
  totalCount: number;
  onNavigate: (view: 'home' | 'list' | 'solve' | 'creator') => void;
  onResetStats: () => void;
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Navbar({ 
  stats, 
  currentView, 
  totalCount, 
  onNavigate, 
  onResetStats,
  user,
  onSignIn,
  onSignOut
}: NavbarProps) {
  const solvedArray = Object.values(stats.problems).filter(p => p.status === 'Solved');
  const solvedCount = solvedArray.length;
  const percentSolved = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-violet-950 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex cursor-pointer items-center space-x-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-605/10 border border-violet-500/40 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.18)]">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-lg font-bold tracking-tight text-white">
                CodeJudge<span className="text-violet-400">AI</span>
              </span>
              <span className="rounded-full bg-violet-950/40 px-1.5 py-0.5 font-mono text-[10px] text-violet-300 border border-violet-500/20">
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'home' 
                ? 'bg-violet-950/50 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-violet-500/15' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'list' || currentView === 'solve'
                ? 'bg-violet-950/50 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-violet-500/15' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            Problems
          </button>
        </nav>

        {/* Right Solved Stats & controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 rounded-full border border-violet-900/40 bg-zinc-950/30 px-3.5 py-1 text-xs shadow-[0_0_12px_rgba(139,92,246,0.06)]">
            <div className="flex items-center space-x-1 text-zinc-400">
              <Award className="h-3.5 w-3.5 text-yellow-500" />
              <span>Solved:</span>
            </div>
            <span className="font-mono font-semibold text-white">
              {solvedCount}/{totalCount}
            </span>
            <div className="h-3 w-px bg-zinc-850" />
            <div className="relative h-2 w-16 overflow-hidden rounded-full bg-zinc-805">
              <div 
                className="h-full rounded-full bg-violet-500 transition-all duration-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" 
                style={{ width: `${percentSolved}%` }}
              />
            </div>
            <span className="font-mono text-violet-400 shrink-0">{percentSolved}%</span>
          </div>

          {solvedCount > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all progress, saved code values, and solved status?')) {
                  onResetStats();
                }
              }}
              title="Reset progress"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/60 hover:bg-rose-950/30 text-zinc-400 hover:text-rose-400 border border-violet-950 hover:border-rose-500/20 transition-all cursor-pointer focus:outline-none"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Google Authentication controls */}
          <div className="flex items-center space-x-1 border-l border-zinc-800 pl-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden xl:inline text-xs text-zinc-400 font-medium">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="flex h-8 px-2.5 items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-450 border border-zinc-805 transition-all text-xs font-bold cursor-pointer focus:outline-none gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5 text-zinc-400 hover:text-rose-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                title="Sign in with Google"
                className="flex h-8 px-2.5 items-center justify-center rounded-lg bg-violet-605/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 hover:border-violet-500/40 transition-all text-xs font-bold cursor-pointer focus:outline-none gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5 text-violet-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
