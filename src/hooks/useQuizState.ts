import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Exam, Answer, QuestionScore, QuizInfo } from '../types';
import { scoreQuestion } from '../utils/scoring';
import { loadQuizProgress, saveQuizProgress, clearQuizProgress } from './useQuizProgress';

interface QuizState {
  exam: Exam | null;
  answers: Record<string, Answer>;
  scores: Record<string, QuestionScore>;
  isLoading: boolean;
  error: string | null;
}

export function useQuizState(quizInfo: QuizInfo) {
  const [state, setState] = useState<QuizState>({
    exam: null,
    answers: {},
    scores: {},
    isLoading: true,
    error: null,
  });
  const [resetKey, setResetKey] = useState(0);

  // Load exam data
  useEffect(() => {
    let cancelled = false;

    async function loadExam() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`/data/${quizInfo.filename}`);
        if (!response.ok) {
          throw new Error('Failed to load exam data');
        }
        const examData: Exam = await response.json();

        if (cancelled) return;

        // Check for saved progress
        const savedProgress = loadQuizProgress(quizInfo.id);

        if (savedProgress && savedProgress.examVersion === examData.version) {
          // Restore progress
          const restoredScores: Record<string, QuestionScore> = {};
          for (const question of examData.questions) {
            const answer = savedProgress.answers[question.id];
            if (answer) {
              restoredScores[question.id] = scoreQuestion(question, answer);
            }
          }

          setState({
            exam: examData,
            answers: savedProgress.answers,
            scores: restoredScores,
            isLoading: false,
            error: null,
          });
        } else {
          // Start fresh
          setState({
            exam: examData,
            answers: {},
            scores: {},
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    }

    loadExam();

    return () => {
      cancelled = true;
    };
  }, [quizInfo.id, quizInfo.filename]);

  // Submit an answer
  const submitAnswer = useCallback(
    (questionId: string, answer: Answer) => {
      setState((prev) => {
        if (!prev.exam) return prev;

        const question = prev.exam.questions.find((q) => q.id === questionId);
        if (!question) return prev;

        const score = scoreQuestion(question, answer);

        const newAnswers = { ...prev.answers, [questionId]: answer };
        const newScores = { ...prev.scores, [questionId]: score };

        // Calculate totals for progress
        const totalQuestions = prev.exam.questions.length;
        const maxPoints = prev.exam.questions.reduce((sum, q) => sum + q.points, 0);

        // Save to localStorage
        const existingProgress = loadQuizProgress(quizInfo.id);
        saveQuizProgress(quizInfo.id, {
          examVersion: prev.exam.version,
          answers: newAnswers,
          startedAt: existingProgress?.startedAt ?? new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          totalQuestions,
          maxPoints,
        });

        return {
          ...prev,
          answers: newAnswers,
          scores: newScores,
        };
      });
    },
    [quizInfo.id]
  );

  // Reset quiz
  const resetQuiz = useCallback(() => {
    clearQuizProgress(quizInfo.id);
    setState((prev) => ({
      ...prev,
      answers: {},
      scores: {},
    }));
    setResetKey((k) => k + 1);
  }, [quizInfo.id]);

  // Computed values
  const stats = useMemo(() => {
    if (!state.exam) {
      return {
        totalQuestions: 0,
        answeredCount: 0,
        earnedPoints: 0,
        maxPoints: 0,
      };
    }

    const totalQuestions = state.exam.questions.length;
    const answeredCount = Object.keys(state.scores).length;
    const earnedPoints = Object.values(state.scores).reduce(
      (sum, s) => sum + s.earnedPoints,
      0
    );
    const maxPoints = state.exam.questions.reduce((sum, q) => sum + q.points, 0);

    return { totalQuestions, answeredCount, earnedPoints, maxPoints };
  }, [state.exam, state.scores]);

  return {
    exam: state.exam,
    answers: state.answers,
    scores: state.scores,
    isLoading: state.isLoading,
    error: state.error,
    submitAnswer,
    resetQuiz,
    resetKey,
    stats,
  };
}
