import { useTranslation } from '../i18n';
import type { TypeStats } from '../types/history';
import type { Language } from '../types';

interface Props {
  stats: TypeStats[];
  language: Language;
}

export function TypeBreakdown({ stats, language }: Props) {
  const { section } = useTranslation(language);
  const t = section('typeBreakdown');
  const questionTypes = section('questionTypes');

  const formatTime = (ms: number): string => {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      {stats.map((stat) => {
        const accuracy = stat.maxPoints > 0
          ? Math.round((stat.earnedPoints / stat.maxPoints) * 100)
          : 0;

        const correctPercent = stat.totalQuestions > 0
          ? (stat.correctCount / stat.totalQuestions) * 100
          : 0;
        const partialPercent = stat.totalQuestions > 0
          ? (stat.partialCount / stat.totalQuestions) * 100
          : 0;
        const incorrectPercent = stat.totalQuestions > 0
          ? (stat.incorrectCount / stat.totalQuestions) * 100
          : 0;

        return (
          <div key={stat.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary text-sm">
                {questionTypes[`${stat.type}_long` as keyof typeof questionTypes] ?? questionTypes[stat.type]}
              </span>
              <div className="flex items-center gap-4 text-xs text-secondary">
                <span>{t.avgTime}: {formatTime(stat.averageTimeMs)}</span>
                <span>{t.accuracy}: {accuracy}%</span>
              </div>
            </div>

            {/* Stacked bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden flex">
              {correctPercent > 0 && (
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${correctPercent}%` }}
                  title={`${t.correct}: ${stat.correctCount}`}
                />
              )}
              {partialPercent > 0 && (
                <div
                  className="bg-yellow-500 h-full"
                  style={{ width: `${partialPercent}%` }}
                  title={`${t.partial}: ${stat.partialCount}`}
                />
              )}
              {incorrectPercent > 0 && (
                <div
                  className="bg-red-500 h-full"
                  style={{ width: `${incorrectPercent}%` }}
                  title={`${t.incorrect}: ${stat.incorrectCount}`}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-secondary">{t.correct}: {stat.correctCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-secondary">{t.partial}: {stat.partialCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-secondary">{t.incorrect}: {stat.incorrectCount}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
