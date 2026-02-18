import { useState, useCallback } from 'react';
import type { QuizProgress } from '../types';
import { quizCatalog } from '../data/quizCatalog';

const STORAGE_PREFIX = 'isaqb-quiz-';

export interface QuizProgressSummary {
  quizId: string;
  answeredCount: number;
  totalQuestions: number;
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
  lastUpdatedAt: string | null;
}

function getStorageKey(quizId: string): string {
  return `${STORAGE_PREFIX}${quizId}`;
}

export function loadQuizProgress(quizId: string): QuizProgress | null {
  try {
    const data = localStorage.getItem(getStorageKey(quizId));
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveQuizProgress(quizId: string, progress: QuizProgress): void {
  try {
    localStorage.setItem(getStorageKey(quizId), JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function clearQuizProgress(quizId: string): void {
  try {
    localStorage.removeItem(getStorageKey(quizId));
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

function computeAllProgress(): QuizProgressSummary[] {
  return quizCatalog.map((quiz) => {
    const progress = loadQuizProgress(quiz.id);

    if (!progress) {
      return {
        quizId: quiz.id,
        answeredCount: 0,
        totalQuestions: 0,
        earnedPoints: 0,
        maxPoints: 0,
        percentage: 0,
        lastUpdatedAt: null,
      };
    }

    const answeredCount = Object.keys(progress.answers).length;

    return {
      quizId: quiz.id,
      answeredCount,
      totalQuestions: progress.totalQuestions,
      earnedPoints: 0,
      maxPoints: progress.maxPoints,
      percentage: progress.totalQuestions > 0
        ? Math.round((answeredCount / progress.totalQuestions) * 100)
        : 0,
      lastUpdatedAt: progress.lastUpdatedAt,
    };
  });
}

export function useAllQuizProgress() {
  const [summaries, setSummaries] = useState<QuizProgressSummary[]>(computeAllProgress);

  const refresh = useCallback(() => {
    setSummaries(computeAllProgress());
  }, []);

  return { summaries, refresh };
}
