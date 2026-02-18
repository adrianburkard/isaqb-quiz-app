import { useState, useCallback } from 'react';
import type { FocusModeConfig } from '../types/learning';
import type { QuizAttempt } from '../types/history';
import type { Question } from '../types';

const FOCUS_SESSION_KEY = 'isaqb-quiz-focus-session';

// Load focus session from localStorage
function loadFocusSession(): FocusModeConfig | null {
  try {
    const data = localStorage.getItem(FOCUS_SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Save focus session to localStorage
function saveFocusSession(config: FocusModeConfig | null): void {
  try {
    if (config) {
      localStorage.setItem(FOCUS_SESSION_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(FOCUS_SESSION_KEY);
    }
  } catch (error) {
    console.error('Failed to save focus session:', error);
  }
}

// Get incorrect question IDs from quiz attempts
export function getIncorrectQuestionIds(
  attempts: QuizAttempt[],
  quizId?: string
): string[] {
  const relevantAttempts = quizId
    ? attempts.filter((a) => a.quizId === quizId)
    : attempts;

  // Get the most recent attempt per quiz
  const latestAttemptByQuiz = new Map<string, QuizAttempt>();
  relevantAttempts.forEach((attempt) => {
    const existing = latestAttemptByQuiz.get(attempt.quizId);
    if (!existing || new Date(attempt.completedAt) > new Date(existing.completedAt)) {
      latestAttemptByQuiz.set(attempt.quizId, attempt);
    }
  });

  // Collect incorrect question IDs
  const incorrectIds = new Set<string>();
  latestAttemptByQuiz.forEach((attempt) => {
    attempt.questionResults.forEach((result) => {
      if (!result.isCorrect) {
        incorrectIds.add(result.questionId);
      }
    });
  });

  return Array.from(incorrectIds);
}

// Get partially correct question IDs (not fully correct but some points)
export function getPartialQuestionIds(
  attempts: QuizAttempt[],
  quizId?: string
): string[] {
  const relevantAttempts = quizId
    ? attempts.filter((a) => a.quizId === quizId)
    : attempts;

  const latestAttemptByQuiz = new Map<string, QuizAttempt>();
  relevantAttempts.forEach((attempt) => {
    const existing = latestAttemptByQuiz.get(attempt.quizId);
    if (!existing || new Date(attempt.completedAt) > new Date(existing.completedAt)) {
      latestAttemptByQuiz.set(attempt.quizId, attempt);
    }
  });

  const partialIds = new Set<string>();
  latestAttemptByQuiz.forEach((attempt) => {
    attempt.questionResults.forEach((result) => {
      if (!result.isCorrect && result.earnedPoints > 0) {
        partialIds.add(result.questionId);
      }
    });
  });

  return Array.from(partialIds);
}

// Filter questions based on focus mode configuration
export function filterQuestionsForFocus(
  questions: Question[],
  questionIds: string[]
): Question[] {
  const idSet = new Set(questionIds);
  return questions.filter((q) => idSet.has(q.id));
}

export function useFocusMode() {
  const [focusConfig, setFocusConfig] = useState<FocusModeConfig | null>(loadFocusSession);

  // Start a focus session
  const startFocusSession = useCallback((config: FocusModeConfig) => {
    setFocusConfig(config);
    saveFocusSession(config);
  }, []);

  // End the focus session
  const endFocusSession = useCallback(() => {
    setFocusConfig(null);
    saveFocusSession(null);
  }, []);

  // Check if there's an active focus session
  const hasFocusSession = focusConfig !== null;

  // Get question IDs for the current focus session
  const getFocusQuestionIds = useCallback((): string[] => {
    return focusConfig?.questionIds ?? [];
  }, [focusConfig]);

  // Create focus config for incorrect questions
  const createIncorrectFocusConfig = useCallback(
    (quizId: string, attempts: QuizAttempt[]): FocusModeConfig | null => {
      const questionIds = getIncorrectQuestionIds(attempts, quizId);
      if (questionIds.length === 0) return null;

      return {
        quizId,
        questionIds,
        mode: 'incorrect',
      };
    },
    []
  );

  // Create focus config for flagged questions
  const createFlaggedFocusConfig = useCallback(
    (quizId: string, flaggedIds: string[]): FocusModeConfig | null => {
      if (flaggedIds.length === 0) return null;

      return {
        quizId,
        questionIds: flaggedIds,
        mode: 'flagged',
      };
    },
    []
  );

  // Create focus config for bookmarked questions
  const createBookmarkedFocusConfig = useCallback(
    (quizId: string, bookmarkedIds: string[]): FocusModeConfig | null => {
      if (bookmarkedIds.length === 0) return null;

      return {
        quizId,
        questionIds: bookmarkedIds,
        mode: 'bookmarked',
      };
    },
    []
  );

  return {
    focusConfig,
    hasFocusSession,
    startFocusSession,
    endFocusSession,
    getFocusQuestionIds,
    createIncorrectFocusConfig,
    createFlaggedFocusConfig,
    createBookmarkedFocusConfig,
  };
}
