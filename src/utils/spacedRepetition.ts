import type { QuestionLearningState, QualityRating, DueReviewSummary } from '../types/learning';
import type { Question } from '../types';

// Default ease factor for new cards
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

/**
 * SM-2 Algorithm Implementation
 *
 * Quality ratings:
 * 5 - perfect response
 * 4 - correct response after hesitation
 * 3 - correct response with serious difficulty
 * 2 - incorrect response but remembered upon seeing correct answer
 * 1 - incorrect response, correct one seemed easy to recall
 * 0 - complete blackout
 */

// Convert quiz score to quality rating
export function scoreToQuality(
  earnedPoints: number,
  maxPoints: number,
  isCorrect: boolean
): QualityRating {
  if (isCorrect) {
    // Perfect answer
    return 5;
  }

  const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;

  if (percentage >= 80) return 4;
  if (percentage >= 60) return 3;
  if (percentage >= 40) return 2;
  if (percentage > 0) return 1;
  return 0;
}

// Calculate new ease factor based on quality
function calculateNewEaseFactor(currentEF: number, quality: QualityRating): number {
  const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(MIN_EASE_FACTOR, newEF);
}

// Calculate next interval based on SM-2
function calculateNextInterval(
  repetitions: number,
  currentInterval: number,
  easeFactor: number
): number {
  if (repetitions === 0) return 1;
  if (repetitions === 1) return 6;
  return Math.round(currentInterval * easeFactor);
}

// Add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Get start of today (midnight)
function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Process a review and return updated learning state
export function processReview(
  state: QuestionLearningState | null,
  questionId: string,
  quizId: string,
  questionType: Question['type'],
  quality: QualityRating
): QuestionLearningState {
  const now = new Date().toISOString();
  const today = getToday();

  // Initialize new state if doesn't exist
  if (!state) {
    state = {
      questionId,
      quizId,
      easeFactor: DEFAULT_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReviewDate: today.toISOString(),
      lastReviewDate: now,
      questionType,
    };
  }

  let { easeFactor, interval, repetitions } = state;

  // Update ease factor
  easeFactor = calculateNewEaseFactor(easeFactor, quality);

  if (quality >= 3) {
    // Successful recall
    interval = calculateNextInterval(repetitions, interval, easeFactor);
    repetitions += 1;
  } else {
    // Failed recall - reset
    repetitions = 0;
    interval = 1;
  }

  // Calculate next review date
  const nextReviewDate = addDays(today, interval);

  return {
    questionId,
    quizId,
    questionType,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewDate: now,
  };
}

// Check if a question is due for review
export function isDue(state: QuestionLearningState): boolean {
  const today = getToday();
  const reviewDate = new Date(state.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  return reviewDate <= today;
}

// Check if a question is overdue (past due date)
export function isOverdue(state: QuestionLearningState): boolean {
  const today = getToday();
  const reviewDate = new Date(state.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  return reviewDate < today;
}

// Get questions due for review, sorted by priority (overdue first, then by date)
export function getDueQuestions(states: QuestionLearningState[]): QuestionLearningState[] {
  return states
    .filter(isDue)
    .sort((a, b) => {
      const dateA = new Date(a.nextReviewDate).getTime();
      const dateB = new Date(b.nextReviewDate).getTime();
      return dateA - dateB;
    });
}

// Get summary of due reviews
export function getDueReviewSummary(states: QuestionLearningState[]): DueReviewSummary {
  const today = getToday();
  const todayStr = today.toISOString().split('T')[0];

  const dueStates = states.filter(isDue);
  const overdueCount = dueStates.filter(isOverdue).length;

  const dueToday = dueStates.filter((state) => {
    const reviewDateStr = state.nextReviewDate.split('T')[0];
    return reviewDateStr === todayStr;
  }).length;

  // Group by quiz
  const byQuizMap = new Map<string, number>();
  dueStates.forEach((state) => {
    const count = byQuizMap.get(state.quizId) || 0;
    byQuizMap.set(state.quizId, count + 1);
  });

  const byQuiz = Array.from(byQuizMap.entries()).map(([quizId, count]) => ({
    quizId,
    count,
  }));

  return {
    totalDue: dueStates.length,
    overdueCount,
    dueToday,
    byQuiz,
  };
}

// Get learning progress stats
export function getLearningStats(states: QuestionLearningState[]) {
  const total = states.length;

  // Categorize by mastery level based on repetitions and interval
  const mastered = states.filter((s) => s.repetitions >= 5 && s.interval >= 21).length;
  const learning = states.filter((s) => s.repetitions > 0 && s.repetitions < 5).length;
  const newOrReset = states.filter((s) => s.repetitions === 0).length;

  // Average ease factor
  const avgEaseFactor = total > 0
    ? states.reduce((sum, s) => sum + s.easeFactor, 0) / total
    : DEFAULT_EASE_FACTOR;

  return {
    total,
    mastered,
    learning,
    newOrReset,
    avgEaseFactor: Math.round(avgEaseFactor * 100) / 100,
  };
}
