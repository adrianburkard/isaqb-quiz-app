import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { quizCatalog } from '../data/quizCatalog';
import type { Language } from '../types';
import type { QuestionLearningState } from '../types/learning';

interface Props {
  language: Language;
  onStartReview: (quizId: string) => void;
  onBack: () => void;
}

export function SpacedRepetitionView({ language, onStartReview, onBack }: Props) {
  const { getDueForReview, getSummary, getStats, clearAllLearning } = useSpacedRepetition();

  const labels = {
    de: {
      title: 'Wiederholungen',
      subtitle: 'Fällige Fragen basierend auf Spaced Repetition',
      back: 'Zurück',
      noDue: 'Keine Wiederholungen fällig',
      noDueDesc: 'Beantworte Fragen in den Quiz, um Wiederholungen zu planen.',
      overdue: 'überfällig',
      dueToday: 'heute fällig',
      totalDue: 'insgesamt fällig',
      startReview: 'Wiederholung starten',
      questions: 'Fragen',
      stats: 'Statistiken',
      mastered: 'Gemeistert',
      learning: 'In Arbeit',
      newOrReset: 'Neu/Zurückgesetzt',
      total: 'Gesamt',
      avgEase: 'Durchschnittliche Leichtigkeit',
      clearAll: 'Alle Daten löschen',
      clearConfirm: 'Alle Lernfortschritte wirklich löschen?',
    },
    en: {
      title: 'Reviews',
      subtitle: 'Due questions based on spaced repetition',
      back: 'Back',
      noDue: 'No reviews due',
      noDueDesc: 'Answer questions in quizzes to schedule reviews.',
      overdue: 'overdue',
      dueToday: 'due today',
      totalDue: 'total due',
      startReview: 'Start Review',
      questions: 'questions',
      stats: 'Statistics',
      mastered: 'Mastered',
      learning: 'Learning',
      newOrReset: 'New/Reset',
      total: 'Total',
      avgEase: 'Average Ease',
      clearAll: 'Clear All Data',
      clearConfirm: 'Delete all learning progress?',
    },
  };

  const t = labels[language];

  const summary = getSummary();
  const stats = getStats();
  const dueQuestions = getDueForReview();

  // Group due questions by quiz
  const dueByQuiz = new Map<string, QuestionLearningState[]>();
  dueQuestions.forEach((q) => {
    const existing = dueByQuiz.get(q.quizId) || [];
    dueByQuiz.set(q.quizId, [...existing, q]);
  });

  const handleClearAll = () => {
    if (window.confirm(t.clearConfirm)) {
      clearAllLearning();
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-header shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors"
              title={t.back}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary">{t.title}</h1>
              <p className="text-secondary text-sm">{t.subtitle}</p>
            </div>
          </div>

          {/* Summary stats */}
          {summary.totalDue > 0 && (
            <div className="flex gap-4 text-sm">
              <div className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                {summary.overdueCount} {t.overdue}
              </div>
              <div className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                {summary.dueToday} {t.dueToday}
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                {summary.totalDue} {t.totalDue}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {summary.totalDue === 0 ? (
          <div className="bg-card rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-muted">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">{t.noDue}</h2>
            <p className="text-secondary">{t.noDueDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(dueByQuiz.entries()).map(([quizId, questions]) => {
              const quiz = quizCatalog.find((q) => q.id === quizId);
              const quizTitle = quiz?.title ?? quizId;

              return (
                <div key={quizId} className="bg-card rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-primary">{quizTitle}</h3>
                      <p className="text-sm text-secondary">
                        {questions.length} {t.questions}
                      </p>
                    </div>
                    <button
                      onClick={() => onStartReview(quizId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {t.startReview}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Learning statistics */}
        {stats.total > 0 && (
          <div className="mt-8">
            <h2 className="font-medium text-primary mb-4">{t.stats}</h2>
            <div className="bg-card rounded-lg shadow-md p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
                  <div className="text-sm text-secondary">{t.mastered}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
                  <div className="text-sm text-secondary">{t.learning}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.newOrReset}</div>
                  <div className="text-sm text-secondary">{t.newOrReset}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-secondary">{t.total}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-default text-center">
                <span className="text-secondary">{t.avgEase}: </span>
                <span className="font-medium text-primary">{stats.avgEaseFactor}</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear all button */}
        {stats.total > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              {t.clearAll}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
