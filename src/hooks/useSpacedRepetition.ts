import { useState, useCallback } from 'react';
import type { QuestionLearningState, LearningData, QualityRating, DueReviewSummary } from '../types/learning';
import type { Question } from '../types';
import {
  processReview,
  getDueQuestions,
  getDueReviewSummary,
  getLearningStats,
  scoreToQuality,
} from '../utils/spacedRepetition';

const LEARNING_KEY = 'isaqb-quiz-learning';

// Load learning data from localStorage
function loadLearningData(): QuestionLearningState[] {
  try {
    const data = localStorage.getItem(LEARNING_KEY);
    if (!data) return [];
    const parsed: LearningData = JSON.parse(data);
    return parsed.questionStates ?? [];
  } catch {
    return [];
  }
}

// Save learning data to localStorage
function saveLearningData(states: QuestionLearningState[]): void {
  try {
    const data: LearningData = { questionStates: states };
    localStorage.setItem(LEARNING_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save learning data:', error);
  }
}

export function useSpacedRepetition() {
  const [questionStates, setQuestionStates] = useState<QuestionLearningState[]>(loadLearningData);

  // Get state for a specific question
  const getQuestionState = useCallback(
    (questionId: string): QuestionLearningState | undefined => {
      return questionStates.find((s) => s.questionId === questionId);
    },
    [questionStates]
  );

  // Record a review result
  const recordReview = useCallback(
    (
      questionId: string,
      quizId: string,
      questionType: Question['type'],
      quality: QualityRating
    ) => {
      setQuestionStates((prev) => {
        const existingState = prev.find((s) => s.questionId === questionId);
        const newState = processReview(existingState ?? null, questionId, quizId, questionType, quality);

        const next = existingState
          ? prev.map((s) => (s.questionId === questionId ? newState : s))
          : [...prev, newState];

        saveLearningData(next);
        return next;
      });
    },
    []
  );

  // Record review from quiz score
  const recordFromScore = useCallback(
    (
      questionId: string,
      quizId: string,
      questionType: Question['type'],
      earnedPoints: number,
      maxPoints: number,
      isCorrect: boolean
    ) => {
      const quality = scoreToQuality(earnedPoints, maxPoints, isCorrect);
      recordReview(questionId, quizId, questionType, quality);
    },
    [recordReview]
  );

  // Get questions due for review
  const getDueForReview = useCallback(
    (quizId?: string): QuestionLearningState[] => {
      const states = quizId
        ? questionStates.filter((s) => s.quizId === quizId)
        : questionStates;
      return getDueQuestions(states);
    },
    [questionStates]
  );

  // Get summary of due reviews
  const getSummary = useCallback((): DueReviewSummary => {
    return getDueReviewSummary(questionStates);
  }, [questionStates]);

  // Get learning stats
  const getStats = useCallback(
    (quizId?: string) => {
      const states = quizId
        ? questionStates.filter((s) => s.quizId === quizId)
        : questionStates;
      return getLearningStats(states);
    },
    [questionStates]
  );

  // Clear learning data for a quiz
  const clearQuizLearning = useCallback((quizId: string) => {
    setQuestionStates((prev) => {
      const next = prev.filter((s) => s.quizId !== quizId);
      saveLearningData(next);
      return next;
    });
  }, []);

  // Clear all learning data
  const clearAllLearning = useCallback(() => {
    setQuestionStates([]);
    saveLearningData([]);
  }, []);

  // Refresh from localStorage
  const refresh = useCallback(() => {
    setQuestionStates(loadLearningData());
  }, []);

  return {
    questionStates,
    getQuestionState,
    recordReview,
    recordFromScore,
    getDueForReview,
    getSummary,
    getStats,
    clearQuizLearning,
    clearAllLearning,
    refresh,
  };
}

// Hook to get due review count for display (lightweight)
export function useDueReviewCount() {
  const [count, setCount] = useState(() => {
    const states = loadLearningData();
    return getDueQuestions(states).length;
  });

  const refresh = useCallback(() => {
    const states = loadLearningData();
    setCount(getDueQuestions(states).length);
  }, []);

  return { count, refresh };
}
