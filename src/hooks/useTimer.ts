import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTimeMs: number;
  onTimeUp?: () => void;
  enabled?: boolean;
  persistKey?: string;
}

interface UseTimerReturn {
  timeRemainingMs: number;
  isRunning: boolean;
  isTimeUp: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTimeMs?: number) => void;
  formattedTime: string;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function useTimer({
  initialTimeMs,
  onTimeUp,
  enabled = true,
  persistKey,
}: UseTimerOptions): UseTimerReturn {
  const [timeRemainingMs, setTimeRemainingMs] = useState(() => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
    }
    return initialTimeMs;
  });

  const [isRunning, setIsRunning] = useState(false);
  const onTimeUpRef = useRef(onTimeUp);
  const hasCalledTimeUp = useRef(false);

  // Keep onTimeUp ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Persist time remaining
  useEffect(() => {
    if (persistKey && timeRemainingMs > 0) {
      localStorage.setItem(persistKey, timeRemainingMs.toString());
    }
  }, [persistKey, timeRemainingMs]);

  // Timer tick
  useEffect(() => {
    if (!enabled || !isRunning || timeRemainingMs <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemainingMs((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          setIsRunning(false);
          if (!hasCalledTimeUp.current && onTimeUpRef.current) {
            hasCalledTimeUp.current = true;
            // Use setTimeout to avoid state updates during render
            setTimeout(() => onTimeUpRef.current?.(), 0);
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, isRunning, timeRemainingMs]);

  const start = useCallback(() => {
    if (timeRemainingMs > 0) {
      setIsRunning(true);
    }
  }, [timeRemainingMs]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTimeMs?: number) => {
    const time = newTimeMs ?? initialTimeMs;
    setTimeRemainingMs(time);
    setIsRunning(false);
    hasCalledTimeUp.current = false;
    if (persistKey) {
      localStorage.setItem(persistKey, time.toString());
    }
  }, [initialTimeMs, persistKey]);

  return {
    timeRemainingMs,
    isRunning,
    isTimeUp: timeRemainingMs <= 0,
    start,
    pause,
    reset,
    formattedTime: formatTime(timeRemainingMs),
  };
}
