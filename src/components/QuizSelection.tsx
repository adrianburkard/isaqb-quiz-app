import { quizCatalog, languageLabels } from '../data/quizCatalog';
import { useAllQuizProgress, clearQuizProgress } from '../hooks/useQuizProgress';
import { PreferencesPanel } from './PreferencesPanel';
import type { QuizInfo, Language } from '../types';

interface Props {
  onSelectQuiz: (quiz: QuizInfo) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function QuizSelection({ onSelectQuiz, language, onLanguageChange }: Props) {
  const { summaries, refresh } = useAllQuizProgress();

  const filteredQuizzes = quizCatalog.filter(
    (quiz) => quiz.language === language
  );

  const handleReset = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMessage = language === 'de'
      ? 'Fortschritt für dieses Quiz wirklich zurücksetzen?'
      : 'Reset progress for this quiz?';
    if (window.confirm(confirmMessage)) {
      clearQuizProgress(quizId);
      refresh();
    }
  };

  const labels = {
    de: {
      title: 'iSAQB CPSA-F Übungsprüfungen',
      subtitle: 'Wähle ein Quiz aus, um zu beginnen oder fortzufahren.',
      answered: 'beantwortet',
      completed: 'Abgeschlossen',
      notStarted: 'Noch nicht gestartet',
      resetTitle: 'Quiz neu starten',
    },
    en: {
      title: 'iSAQB CPSA-F Practice Exams',
      subtitle: 'Select a quiz to start or continue.',
      answered: 'answered',
      completed: 'Completed',
      notStarted: 'Not started yet',
      resetTitle: 'Reset quiz',
    },
  };

  const t = labels[language];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.title}</h1>
            <PreferencesPanel language={language} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t.subtitle}</p>

          {/* Language Tabs */}
          <div className="flex gap-2">
            {(['de', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  language === lang
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-4">
          {filteredQuizzes.map((quiz) => {
            const progress = summaries.find((s) => s.quizId === quiz.id);
            const hasProgress = progress && progress.answeredCount > 0;
            const isComplete =
              progress &&
              progress.answeredCount === progress.totalQuestions &&
              progress.totalQuestions > 0;

            return (
              <div
                key={quiz.id}
                onClick={() => onSelectQuiz(quiz)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {quiz.title}
                    </h2>
                    {quiz.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {quiz.description}
                      </p>
                    )}

                    {hasProgress && (
                      <div className="mt-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {progress.answeredCount} / {progress.totalQuestions}{' '}
                            {t.answered}
                          </span>
                          {isComplete && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                              {t.completed}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isComplete ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!hasProgress && (
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">{t.notStarted}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {hasProgress && (
                      <button
                        onClick={(e) => handleReset(quiz.id, e)}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                        title={t.resetTitle}
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    )}
                    <div className="p-2 text-blue-500">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
