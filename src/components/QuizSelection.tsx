import { quizCatalog, languageLabels } from '../data/quizCatalog';
import { useAllQuizProgress, clearQuizProgress } from '../hooks/useQuizProgress';
import { useAllBookmarks } from '../hooks/useQuestionMarks';
import { useQuizHistory } from '../hooks/useQuizHistory';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { PreferencesPanel } from './PreferencesPanel';
import type { QuizInfo, Language } from '../types';

interface Props {
  onSelectQuiz: (quiz: QuizInfo) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onShowBookmarks?: () => void;
  onShowHistory?: () => void;
  onShowReviews?: () => void;
}

export function QuizSelection({ onSelectQuiz, language, onLanguageChange, onShowBookmarks, onShowHistory, onShowReviews }: Props) {
  const { summaries, refresh } = useAllQuizProgress();
  const { count: bookmarkCount } = useAllBookmarks();
  const { totalAttempts } = useQuizHistory();
  const { getSummary } = useSpacedRepetition();
  const dueReviews = getSummary().totalDue;

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
      bookmarks: 'Lesezeichen',
      history: 'Verlauf',
      reviews: 'Wiederholungen',
    },
    en: {
      title: 'iSAQB CPSA-F Practice Exams',
      subtitle: 'Select a quiz to start or continue.',
      answered: 'answered',
      completed: 'Completed',
      notStarted: 'Not started yet',
      resetTitle: 'Reset quiz',
      bookmarks: 'Bookmarks',
      history: 'History',
      reviews: 'Reviews',
    },
  };

  const t = labels[language];

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-header shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
            <div className="flex items-center gap-2">
              {onShowBookmarks && (
                <button
                  onClick={onShowBookmarks}
                  className="relative p-2 text-muted hover:text-blue-500 hover:bg-hover rounded-lg transition-colors"
                  title={t.bookmarks}
                >
                  <svg
                    className="w-5 h-5"
                    fill={bookmarkCount > 0 ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  {bookmarkCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {bookmarkCount > 9 ? '9+' : bookmarkCount}
                    </span>
                  )}
                </button>
              )}
              {onShowHistory && (
                <button
                  onClick={onShowHistory}
                  className="relative p-2 text-muted hover:text-green-500 hover:bg-hover rounded-lg transition-colors"
                  title={t.history}
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {totalAttempts > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalAttempts > 9 ? '9+' : totalAttempts}
                    </span>
                  )}
                </button>
              )}
              {onShowReviews && (
                <button
                  onClick={onShowReviews}
                  className="relative p-2 text-muted hover:text-purple-500 hover:bg-hover rounded-lg transition-colors"
                  title={t.reviews}
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {dueReviews > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {dueReviews > 9 ? '9+' : dueReviews}
                    </span>
                  )}
                </button>
              )}
              <PreferencesPanel language={language} />
            </div>
          </div>
          <p className="text-secondary mb-4">{t.subtitle}</p>

          {/* Language Tabs */}
          <div className="flex gap-2">
            {(['de', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  language === lang
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-secondary hover:bg-hover'
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
                className="bg-card rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-primary">
                      {quiz.title}
                    </h2>
                    {quiz.description && (
                      <p className="text-secondary text-sm mt-1">
                        {quiz.description}
                      </p>
                    )}

                    {hasProgress && (
                      <div className="mt-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-secondary">
                            {progress.answeredCount} / {progress.totalQuestions}{' '}
                            {t.answered}
                          </span>
                          {isComplete && (
                            <span className="px-2 py-0.5 bg-success text-success rounded-full text-xs font-medium">
                              {t.completed}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
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
                      <p className="mt-3 text-sm text-muted">{t.notStarted}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {hasProgress && (
                      <button
                        onClick={(e) => handleReset(quiz.id, e)}
                        className="p-2 text-muted hover:text-orange-500 hover:bg-orange-100 rounded-lg transition-colors"
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
