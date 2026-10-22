/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProblemList from './components/ProblemList';
import ProblemSolvingView from './components/ProblemSolvingView';
import { UserStats, Problem } from './types';
import { getProblemsFromDB, syncChallengesWithDB } from './firebaseService';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { Loader2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'codejudge_ai_stats_v1';

const defaultStats: UserStats = {
  solvedCount: 0,
  attemptedCount: 0,
  totalSubmissions: 0,
  problems: {},
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'list' | 'solve' | 'creator'>('home');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load database problems
  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const data = await getProblemsFromDB();
      setProblems(data || []);
    } catch (err: any) {
      console.error('Failed to retrieve challenges from Firestore backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Monitor auth & retrieve data on mount
  useEffect(() => {
    fetchProblems();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'divyasanthigandhi@gmail.com') {
        console.log('Detected admin user. Auto-syncing problems to Cloud Firestore...');
        try {
          await syncChallengesWithDB();
          await fetchProblems();
        } catch (error) {
          console.error('Error syncing challenges on admin login:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize stats on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setStats(JSON.parse(stored));
      } catch (err) {
        setStats(defaultStats);
      }
    }
  }, []);

  // Update statistics helper
  const handleUpdateStats = (problemId: string, status: 'Solved' | 'Attempted', code: string) => {
    setStats((prev) => {
      const existingProblem = prev.problems[problemId];

      const updatedProblems = {
        ...prev.problems,
        [problemId]: {
          problemId,
          status: existingProblem?.status === 'Solved' ? 'Solved' : status, // keep Solved if already Solved
          lastCode: code,
        },
      };

      const solvedCount = Object.values(updatedProblems).filter((p: any) => p.status === 'Solved').length;
      const attemptedCount = Object.values(updatedProblems).filter((p: any) => p.status === 'Attempted').length;

      const newStats: UserStats = {
        solvedCount,
        attemptedCount,
        totalSubmissions: prev.totalSubmissions + 1,
        problems: updatedProblems,
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    });
  };

  // Reset stats helper
  const handleResetStats = () => {
    setStats(defaultStats);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Clean out individual user histories
    problems.forEach((p) => {
      localStorage.removeItem(`codejudge_history_${p.id}`);
    });

    setCurrentView('home');
    setSelectedProblemId(null);
  };

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    setCurrentView('solve');
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const currentProblem = problems.find((p) => p.id === selectedProblemId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-violet-500/20 selection:text-violet-300">
      {/* Navigation Top Bar */}
      <Navbar 
        stats={stats} 
        currentView={currentView} 
        totalCount={problems.length}
        onNavigate={(view) => {
          if (view === 'creator') return;
          setCurrentView(view);
          if (view !== 'solve') setSelectedProblemId(null);
        }}
        onResetStats={handleResetStats}
        user={user}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Loader State */}
      {isLoading ? (
        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="h-10 w-10 text-violet-500 animate-spin mb-3" />
          <h3 className="text-white font-bold text-base mb-1">Connecting to Firestore</h3>
          <p className="text-zinc-500 text-xs max-w-xs">Loading durable challenge index sheets from cloud secure nodes...</p>
        </div>
      ) : (
        /* Main View Router */
        <main className="flex-1">
          {currentView === 'home' && (
            <Home 
              stats={stats} 
              onStartPractice={() => setCurrentView('list')} 
            />
          )}

          {currentView === 'list' && (
            <ProblemList 
              problems={problems} 
              stats={stats} 
              onSelectProblem={handleSelectProblem}
              onNavigate={(view) => {
                setCurrentView(view);
                if (view !== 'solve') setSelectedProblemId(null);
              }}
            />
          )}

          {currentView === 'solve' && currentProblem && (
            <ProblemSolvingView 
              problem={currentProblem}
              stats={stats}
              onBack={() => {
                setCurrentView('list');
                setSelectedProblemId(null);
              }}
              onUpdateStats={handleUpdateStats}
            />
          )}
        </main>
      )}
    </div>
  );
}
