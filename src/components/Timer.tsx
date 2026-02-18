import { useTranslation } from '../i18n';
import type { Language } from '../types';

interface Props {
  formattedTime: string;
  isRunning: boolean;
  isTimeUp: boolean;
  timeRemainingMs: number;
  onPause?: () => void;
  onResume?: () => void;
  language?: Language;
}

export function Timer({
  formattedTime,
  isRunning,
  isTimeUp,
  timeRemainingMs,
  onPause,
  onResume,
  language = 'de',
}: Props) {
  const { section } = useTranslation(language);
  const t = section('timer');
  // Warning threshold: 5 minutes
  const isWarning = timeRemainingMs > 0 && timeRemainingMs <= 5 * 60 * 1000;
  // Critical threshold: 1 minute
  const isCritical = timeRemainingMs > 0 && timeRemainingMs <= 60 * 1000;

  let colorClass = 'text-secondary';
  if (isTimeUp) {
    colorClass = 'text-red-600';
  } else if (isCritical) {
    colorClass = 'text-red-500 animate-pulse';
  } else if (isWarning) {
    colorClass = 'text-orange-500';
  }

  return (
    <div className="flex items-center gap-2">
      <svg
        className={`w-5 h-5 ${colorClass}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className={`font-mono font-medium ${colorClass}`}>
        {isTimeUp ? '0:00' : formattedTime}
      </span>
      {(onPause || onResume) && !isTimeUp && (
        <button
          onClick={isRunning ? onPause : onResume}
          className="p-1 text-muted hover:text-primary hover:bg-hover rounded transition-colors"
          title={isRunning ? t.pause : t.resume}
        >
          {isRunning ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
