import { useQuizHistory, calculateTypeStats, getBestAttempt, getAveragePercentage } from '../hooks/useQuizHistory';
import { TypeBreakdown } from './TypeBreakdown';
import type { Language } from '../types';
import type { QuizAttempt } from '../types/history';

interface Props {
  language: Language;
  onViewAttempt: (attempt: QuizAttempt) => void;
  onBack: () => void;
}

export function HistoryView({ language, onViewAttempt, onBack }: Props) {
  const { attempts, deleteAttempt, clearHistory } = useQuizHistory();

  const labels = {
    de: {
      title: 'Verlauf',
      subtitle: 'Deine vergangenen Versuche',
      empty: 'Noch keine Versuche',
      emptyHint: 'Schließe ein Quiz ab, um deinen Fortschritt zu sehen.',
      clearAll: 'Verlauf löschen',
      delete: 'Löschen',
      view: 'Details',
      back: 'Zurück',
      passed: 'Bestanden',
      failed: 'Nicht bestanden',
      practice: 'Übung',
      exam: 'Prüfung',
      duration: 'Dauer',
      stats: 'Statistiken nach Fragentyp',
      best: 'Bester Versuch',
      average: 'Durchschnitt',
      attempts: 'Versuche',
    },
    en: {
      title: 'History',
      subtitle: 'Your past attempts',
      empty: 'No attempts yet',
      emptyHint: 'Complete a quiz to see your progress.',
      clearAll: 'Clear history',
      delete: 'Delete',
      view: 'Details',
      back: 'Back',
      passed: 'Passed',
      failed: 'Failed',
      practice: 'Practice',
      exam: 'Exam',
      duration: 'Duration',
      stats: 'Statistics by Question Type',
      best: 'Best attempt',
      average: 'Average',
      attempts: 'attempts',
    },
  };

  const t = labels[language];

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClearAll = () => {
    const confirmMessage = language === 'de'
      ? 'Gesamten Verlauf wirklich löschen?'
      : 'Delete all history?';
    if (window.confirm(confirmMessage)) {
      clearHistory();
    }
  };

  const handleDelete = (attemptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMessage = language === 'de'
      ? 'Diesen Versuch wirklich löschen?'
      : 'Delete this attempt?';
    if (window.confirm(confirmMessage)) {
      deleteAttempt(attemptId);
    }
  };

  const typeStats = calculateTypeStats(attempts);
  const bestAttempt = getBestAttempt(attempts);
  const averagePercentage = getAveragePercentage(attempts);

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-header shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors"
              title={t.back}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
              <p className="text-secondary text-sm">{t.subtitle}</p>
            </div>
          </div>
          {attempts.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleClearAll}
                className="text-sm text-error hover:underline"
              >
                {t.clearAll}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-muted mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-secondary text-lg mb-2">{t.empty}</p>
            <p className="text-muted text-sm">{t.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-primary">{attempts.length}</div>
                <div className="text-sm text-secondary">{t.attempts}</div>
              </div>
              <div className="bg-card rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-primary">{bestAttempt?.percentage ?? 0}%</div>
                <div className="text-sm text-secondary">{t.best}</div>
              </div>
              <div className="bg-card rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-primary">{averagePercentage}%</div>
                <div className="text-sm text-secondary">{t.average}</div>
              </div>
            </div>

            {/* Type Breakdown */}
            {typeStats.length > 0 && (
              <div className="bg-card rounded-lg shadow-md p-4">
                <h2 className="font-medium text-primary mb-4">{t.stats}</h2>
                <TypeBreakdown stats={typeStats} language={language} />
              </div>
            )}

            {/* Attempts List */}
            <div className="space-y-3">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  onClick={() => onViewAttempt(attempt)}
                  className="bg-card rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-primary">{attempt.quizTitle}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          attempt.mode === 'exam'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {attempt.mode === 'exam' ? t.exam : t.practice}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-secondary">
                        <span>{formatDate(attempt.completedAt)}</span>
                        <span>{t.duration}: {formatDuration(attempt.durationMs)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          attempt.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {attempt.percentage}%
                        </div>
                        <div className={`text-xs ${
                          attempt.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {attempt.passed ? t.passed : t.failed}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(attempt.id, e)}
                        className="p-2 text-muted hover:text-error hover:bg-hover rounded-lg transition-colors"
                        title={t.delete}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
