import type { ReactNode } from 'react';
import { useTranslation } from '../i18n';
import type { Language } from '../types';

interface Props {
  title: string;
  answeredCount: number;
  totalCount: number;
  earnedPoints: number;
  maxPoints: number;
  showScore: boolean;
  onBack?: () => void;
  questionNav?: ReactNode;
  showNav?: boolean;
  onToggleNav?: () => void;
  language?: Language;
}

export function Header({
  title,
  answeredCount,
  totalCount,
  earnedPoints,
  maxPoints,
  showScore,
  onBack,
  questionNav,
  showNav = true,
  onToggleNav,
  language = 'de',
}: Props) {
  const { section } = useTranslation(language);
  const t = section('header');
  const common = section('common');
  return (
    <header className="bg-header shadow-sm sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors"
              title={t.backToOverview}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-primary">{title}</h1>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-secondary">
              {answeredCount} / {totalCount} {common.answered}
            </span>
            {showScore && (
              <span className="font-medium text-blue-600">
                {earnedPoints.toFixed(2)} / {maxPoints} {common.points}
              </span>
            )}
          </div>

          {onToggleNav && (
            <button
              onClick={onToggleNav}
              className="p-1 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors"
              title={showNav ? t.hideNav : t.showNav}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showNav ? 'M5 15l7-7 7 7' : 'M5 9l7 7 7-7'}
                />
              </svg>
            </button>
          )}
        </div>

        {totalCount > 0 && (
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                answeredCount === totalCount ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(answeredCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        {questionNav && showNav && (
          <div className="pt-3 mt-3 border-t border-default">
            {questionNav}
          </div>
        )}
      </div>
    </header>
  );
}
