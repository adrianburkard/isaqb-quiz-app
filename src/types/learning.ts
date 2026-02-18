import type { Question } from './index';

// SM-2 algorithm learning state for a question
export interface QuestionLearningState {
  questionId: string;
  quizId: string;
  easeFactor: number;      // EF >= 1.3, starts at 2.5
  interval: number;        // Days until next review
  repetitions: number;     // Number of successful reviews
  nextReviewDate: string;  // ISO date string
  lastReviewDate: string;  // ISO date string
  questionType: Question['type'];
}

// Quality rating for SM-2 (0-5 scale)
export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5;

// Learning data stored in localStorage
export interface LearningData {
  questionStates: QuestionLearningState[];
}

// Focus mode configuration
export interface FocusModeConfig {
  quizId: string;
  questionIds: string[];
  mode: 'incorrect' | 'flagged' | 'bookmarked' | 'custom';
}

// Review session summary
export interface ReviewSession {
  startedAt: string;
  completedAt: string;
  questionsReviewed: number;
  correctCount: number;
  incorrectCount: number;
}

// Due review summary for display
export interface DueReviewSummary {
  totalDue: number;
  overdueCount: number;
  dueToday: number;
  byQuiz: { quizId: string; count: number }[];
}
