import { useRef, useCallback, useEffect } from 'react';

interface UseQuestionTimingOptions {
  questionIds: string[];
  enabled?: boolean;
}

export function useQuestionTiming({ questionIds, enabled = true }: UseQuestionTimingOptions) {
  // Track accumulated time per question
  const timings = useRef<Record<string, number>>({});
  // Track when current question became visible
  const currentQuestionStart = useRef<{ questionId: string; startTime: number } | null>(null);

  // Initialize timings for all questions
  useEffect(() => {
    questionIds.forEach((id) => {
      if (timings.current[id] === undefined) {
        timings.current[id] = 0;
      }
    });
  }, [questionIds]);

  // Called when a question becomes the current visible question
  const onQuestionVisible = useCallback((questionId: string) => {
    if (!enabled) return;

    const now = Date.now();

    // Save time for previous question
    if (currentQuestionStart.current) {
      const elapsed = now - currentQuestionStart.current.startTime;
      const prevId = currentQuestionStart.current.questionId;
      timings.current[prevId] = (timings.current[prevId] ?? 0) + elapsed;
    }

    // Start timing new question
    currentQuestionStart.current = { questionId, startTime: now };
  }, [enabled]);

  // Called when quiz is submitted or user leaves
  const finalizeTiming = useCallback(() => {
    if (currentQuestionStart.current) {
      const now = Date.now();
      const elapsed = now - currentQuestionStart.current.startTime;
      const questionId = currentQuestionStart.current.questionId;
      timings.current[questionId] = (timings.current[questionId] ?? 0) + elapsed;
      currentQuestionStart.current = null;
    }
  }, []);

  // Get timing for a specific question
  const getQuestionTime = useCallback((questionId: string): number => {
    let time = timings.current[questionId] ?? 0;

    // Add current elapsed time if this is the active question
    if (currentQuestionStart.current?.questionId === questionId) {
      time += Date.now() - currentQuestionStart.current.startTime;
    }

    return time;
  }, []);

  // Get all timings
  const getAllTimings = useCallback((): Record<string, number> => {
    finalizeTiming();
    return { ...timings.current };
  }, [finalizeTiming]);

  // Reset all timings
  const resetTimings = useCallback(() => {
    timings.current = {};
    currentQuestionStart.current = null;
    questionIds.forEach((id) => {
      timings.current[id] = 0;
    });
  }, [questionIds]);

  // Cleanup on unmount - save final timing
  useEffect(() => {
    return () => {
      finalizeTiming();
    };
  }, [finalizeTiming]);

  return {
    onQuestionVisible,
    finalizeTiming,
    getQuestionTime,
    getAllTimings,
    resetTimings,
  };
}
