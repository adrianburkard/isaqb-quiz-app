import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Exam, Answer, QuestionScore, QuizInfo, QuizSettings, Question } from '../types';
import { scoreQuestion } from '../utils/scoring';
import { loadQuizProgress, saveQuizProgress, clearQuizProgress } from './useQuizProgress';
import { shuffleWithSeed, generateRandomSeed } from '../utils/shuffle';

const DEFAULT_SETTINGS: QuizSettings = {
  mode: 'practice',
  timerEnabled: false,
  timerMinutes: 75,
  randomOrder: false,
};

interface QuizState {
  exam: Exam | null;
  answers: Record<string, Answer>;
  scores: Record<string, QuestionScore>;
  isLoading: boolean;
  error: string | null;
  settings: QuizSettings;
  questionOrder: string[]; // Question IDs in display order
  needsSetup: boolean; // True if no progress exists and setup is needed
  timeRemainingMs: number | null;
}

export function useQuizState(quizInfo: QuizInfo) {
  const [state, setState] = useState<QuizState>({
    exam: null,
    answers: {},
    scores: {},
    isLoading: true,
    error: null,
    settings: DEFAULT_SETTINGS,
    questionOrder: [],
    needsSetup: false,
    timeRemainingMs: null,
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
        const defaultOrder = examData.questions.map((q) => q.id);

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
            settings: savedProgress.settings ?? DEFAULT_SETTINGS,
            questionOrder: savedProgress.questionOrder ?? defaultOrder,
            needsSetup: false,
            timeRemainingMs: savedProgress.timeRemainingMs ?? null,
          });
        } else {
          // No saved progress - needs setup
          setState({
            exam: examData,
            answers: {},
            scores: {},
            isLoading: false,
            error: null,
            settings: DEFAULT_SETTINGS,
            questionOrder: defaultOrder,
            needsSetup: true,
            timeRemainingMs: null,
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

  // Start quiz with settings (called after setup modal)
  const startWithSettings = useCallback(
    (settings: QuizSettings) => {
      setState((prev) => {
        if (!prev.exam) return prev;

        const defaultOrder = prev.exam.questions.map((q) => q.id);
        let questionOrder = defaultOrder;

        if (settings.randomOrder) {
          const seed = generateRandomSeed();
          questionOrder = shuffleWithSeed(defaultOrder, seed);
        }

        const timeRemainingMs = settings.timerEnabled
          ? settings.timerMinutes * 60 * 1000
          : null;

        // Save initial progress with settings
        const totalQuestions = prev.exam.questions.length;
        const maxPoints = prev.exam.questions.reduce((sum, q) => sum + q.points, 0);

        saveQuizProgress(quizInfo.id, {
          examVersion: prev.exam.version,
          answers: {},
          startedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          totalQuestions,
          maxPoints,
          settings,
          questionOrder,
          timeRemainingMs: timeRemainingMs ?? undefined,
        });

        return {
          ...prev,
          settings,
          questionOrder,
          needsSetup: false,
          timeRemainingMs,
        };
      });
    },
    [quizInfo.id]
  );

  // Update time remaining (for timer persistence)
  const updateTimeRemaining = useCallback(
    (timeMs: number) => {
      setState((prev) => ({ ...prev, timeRemainingMs: timeMs }));

      // Persist to localStorage
      const existingProgress = loadQuizProgress(quizInfo.id);
      if (existingProgress) {
        saveQuizProgress(quizInfo.id, {
          ...existingProgress,
          timeRemainingMs: timeMs,
          lastUpdatedAt: new Date().toISOString(),
        });
      }
    },
    [quizInfo.id]
  );

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

        // Save to localStorage (preserving settings and order)
        const existingProgress = loadQuizProgress(quizInfo.id);
        saveQuizProgress(quizInfo.id, {
          examVersion: prev.exam.version,
          answers: newAnswers,
          startedAt: existingProgress?.startedAt ?? new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          totalQuestions,
          maxPoints,
          settings: prev.settings,
          questionOrder: prev.questionOrder,
          timeRemainingMs: prev.timeRemainingMs ?? undefined,
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

  // Reset quiz (back to setup)
  const resetQuiz = useCallback(() => {
    clearQuizProgress(quizInfo.id);
    setState((prev) => ({
      ...prev,
      answers: {},
      scores: {},
      settings: DEFAULT_SETTINGS,
      questionOrder: prev.exam?.questions.map((q) => q.id) ?? [],
      needsSetup: true,
      timeRemainingMs: null,
    }));
    setResetKey((k) => k + 1);
  }, [quizInfo.id]);

  // Get questions in the correct order
  const orderedQuestions = useMemo((): Question[] => {
    if (!state.exam) return [];

    const questionMap = new Map(state.exam.questions.map((q) => [q.id, q]));
    return state.questionOrder
      .map((id) => questionMap.get(id))
      .filter((q): q is Question => q !== undefined);
  }, [state.exam, state.questionOrder]);

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
    // New for exam mode
    settings: state.settings,
    orderedQuestions,
    needsSetup: state.needsSetup,
    startWithSettings,
    timeRemainingMs: state.timeRemainingMs,
    updateTimeRemaining,
  };
}
