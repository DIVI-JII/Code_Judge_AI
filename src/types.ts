/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TestCase {
  id: string;
  is_hidden: boolean;
  input: string;
  expected: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  starterCode: string;
  publicTestCases: TestCase[];
  hiddenTestCases: TestCase[];
}

export type Verdict = 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Evaluating';

export interface SubmissionResult {
  verdict: Verdict;
  passedCount?: string; // e.g., "1/3"
  runtime?: string;     // e.g., "14ms"
  memory?: string;      // e.g., "8.2MB"
  error?: string;       // stderr / traceback style
  stdout?: string;      // Simulated standard output
  failedPublicTest?: {
    input: string;
    expected: string;
    actual: string;
  };
}

export interface ProblemStatus {
  problemId: string;
  status: 'Solved' | 'Attempted' | 'Unattempted';
  lastCode: string;
}

export interface UserStats {
  solvedCount: number;
  attemptedCount: number;
  totalSubmissions: number;
  problems: Record<string, ProblemStatus>;
}
