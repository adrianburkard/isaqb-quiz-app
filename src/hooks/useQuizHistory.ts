import { useState, useCallback } from 'react';
import type { QuizAttempt, HistoryData, QuestionResult, TypeStats } from '../types/history';
import type { Question } from '../types';

const HISTORY_KEY = 'isaqb-quiz-history';
const PASSING_PERCENTAGE = 60; // iSAQB passing threshold

// Load history from localStorage
function loadHistory(): QuizAttempt[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    const parsed: HistoryData = JSON.parse(data);
    return parsed.attempts ?? [];
  } catch {
    return [];
  }
}

// Save history to localStorage
function saveHistory(attempts: QuizAttempt[]): void {
  try {
    const data: HistoryData = { attempts };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// Generate unique attempt ID
function generateAttemptId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useQuizHistory() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(loadHistory);

  // Save a completed attempt
  const saveAttempt = useCallback((
    quizId: string,
    quizTitle: string,
    startedAt: string,
    earnedPoints: number,
    maxPoints: number,
    questionResults: QuestionResult[],
    mode: 'practice' | 'exam'
  ): QuizAttempt => {
    const completedAt = new Date().toISOString();
    const startTime = new Date(startedAt).getTime();
    const endTime = new Date(completedAt).getTime();
    const durationMs = endTime - startTime;
    const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

    const attempt: QuizAttempt = {
      id: generateAttemptId(),
      quizId,
      quizTitle,
      completedAt,
      startedAt,
      durationMs,
      earnedPoints,
      maxPoints,
      percentage,
      passed: percentage >= PASSING_PERCENTAGE,
      questionResults,
      mode,
    };

    setAttempts((prev) => {
      const next = [attempt, ...prev];
      saveHistory(next);
      return next;
    });

    return attempt;
  }, []);

  // Get attempts for a specific quiz
  const getQuizAttempts = useCallback((quizId: string): QuizAttempt[] => {
    return attempts.filter((a) => a.quizId === quizId);
  }, [attempts]);

  // Get a specific attempt by ID
  const getAttempt = useCallback((attemptId: string): QuizAttempt | undefined => {
    return attempts.find((a) => a.id === attemptId);
  }, [attempts]);

  // Delete an attempt
  const deleteAttempt = useCallback((attemptId: string) => {
    setAttempts((prev) => {
      const next = prev.filter((a) => a.id !== attemptId);
      saveHistory(next);
      return next;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setAttempts([]);
    saveHistory([]);
  }, []);

  // Clear history for a specific quiz
  const clearQuizHistory = useCallback((quizId: string) => {
    setAttempts((prev) => {
      const next = prev.filter((a) => a.quizId !== quizId);
      saveHistory(next);
      return next;
    });
  }, []);

  // Refresh from localStorage
  const refresh = useCallback(() => {
    setAttempts(loadHistory());
  }, []);

  return {
    attempts,
    saveAttempt,
    getQuizAttempts,
    getAttempt,
    deleteAttempt,
    clearHistory,
    clearQuizHistory,
    refresh,
    totalAttempts: attempts.length,
  };
}

// Calculate stats by question type from attempts
export function calculateTypeStats(attempts: QuizAttempt[]): TypeStats[] {
  const statsMap = new Map<Question['type'], TypeStats>();

  const types: Question['type'][] = ['single_choice', 'multiple_choice', 'classification_matrix'];
  types.forEach((type) => {
    statsMap.set(type, {
      type,
      totalQuestions: 0,
      correctCount: 0,
      partialCount: 0,
      incorrectCount: 0,
      earnedPoints: 0,
      maxPoints: 0,
      averageTimeMs: 0,
    });
  });

  const totalTimeByType: Record<string, number> = {
    single_choice: 0,
    multiple_choice: 0,
    classification_matrix: 0,
  };

  attempts.forEach((attempt) => {
    attempt.questionResults.forEach((result) => {
      const stats = statsMap.get(result.questionType);
      if (!stats) return;

      stats.totalQuestions++;
      stats.earnedPoints += result.earnedPoints;
      stats.maxPoints += result.maxPoints;
      totalTimeByType[result.questionType] += result.timeSpentMs;

      if (result.isCorrect) {
        stats.correctCount++;
      } else if (result.earnedPoints > 0) {
        stats.partialCount++;
      } else {
        stats.incorrectCount++;
      }
    });
  });

  // Calculate averages
  types.forEach((type) => {
    const stats = statsMap.get(type)!;
    if (stats.totalQuestions > 0) {
      stats.averageTimeMs = Math.round(totalTimeByType[type] / stats.totalQuestions);
    }
  });

  return Array.from(statsMap.values()).filter((s) => s.totalQuestions > 0);
}

// Get best attempt for a quiz
export function getBestAttempt(attempts: QuizAttempt[]): QuizAttempt | undefined {
  if (attempts.length === 0) return undefined;
  return attempts.reduce((best, current) =>
    current.percentage > best.percentage ? current : best
  );
}

// Get average percentage for a quiz
export function getAveragePercentage(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0;
  const total = attempts.reduce((sum, a) => sum + a.percentage, 0);
  return Math.round(total / attempts.length);
}
