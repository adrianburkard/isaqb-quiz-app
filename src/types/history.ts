import type { Question } from './index';

// Result for a single question in an attempt
export interface QuestionResult {
  questionId: string;
  questionType: Question['type'];
  earnedPoints: number;
  maxPoints: number;
  isCorrect: boolean;
  timeSpentMs: number;
}

// A completed quiz attempt
export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  completedAt: string;
  startedAt: string;
  durationMs: number;
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
  passed: boolean; // >= 60% for iSAQB
  questionResults: QuestionResult[];
  mode: 'practice' | 'exam';
}

// History storage structure
export interface HistoryData {
  attempts: QuizAttempt[];
}

// Stats by question type
export interface TypeStats {
  type: Question['type'];
  totalQuestions: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
  earnedPoints: number;
  maxPoints: number;
  averageTimeMs: number;
}
