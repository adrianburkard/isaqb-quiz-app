import { useAllBookmarks } from '../hooks/useQuestionMarks';
import { quizCatalog } from '../data/quizCatalog';
import type { Language, QuizInfo } from '../types';

interface Props {
  language: Language;
  onSelectQuiz: (quiz: QuizInfo, questionId: string) => void;
  onBack: () => void;
}

export function BookmarkedQuestions({ language, onSelectQuiz, onBack }: Props) {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useAllBookmarks();

  const labels = {
    de: {
      title: 'Lesezeichen',
      subtitle: 'Gespeicherte Fragen zum Wiederholen',
      empty: 'Keine Lesezeichen vorhanden',
      emptyHint: 'Markiere Fragen mit dem Lesezeichen-Symbol, um sie hier zu speichern.',
      clearAll: 'Alle entfernen',
      remove: 'Entfernen',
      back: 'Zurück',
      goToQuestion: 'Zur Frage',
      fromQuiz: 'aus',
    },
    en: {
      title: 'Bookmarks',
      subtitle: 'Saved questions for review',
      empty: 'No bookmarks yet',
      emptyHint: 'Mark questions with the bookmark icon to save them here.',
      clearAll: 'Clear all',
      remove: 'Remove',
      back: 'Back',
      goToQuestion: 'Go to question',
      fromQuiz: 'from',
    },
  };

  const t = labels[language];

  // Group bookmarks by quiz
  const bookmarksByQuiz = bookmarks.reduce(
    (acc, bookmark) => {
      if (!acc[bookmark.quizId]) {
        acc[bookmark.quizId] = [];
      }
      acc[bookmark.quizId].push(bookmark);
      return acc;
    },
    {} as Record<string, typeof bookmarks>
  );

  const handleGoToQuestion = (quizId: string, questionId: string) => {
    const quiz = quizCatalog.find((q) => q.id === quizId);
    if (quiz) {
      onSelectQuiz(quiz, questionId);
    }
  };

  const handleClearAll = () => {
    const confirmMessage = language === 'de'
      ? 'Alle Lesezeichen wirklich entfernen?'
      : 'Remove all bookmarks?';
    if (window.confirm(confirmMessage)) {
      clearAllBookmarks();
    }
  };

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
            <div>
              <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
              <p className="text-secondary text-sm">{t.subtitle}</p>
            </div>
          </div>
          {bookmarks.length > 0 && (
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
        {bookmarks.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p className="text-secondary text-lg mb-2">{t.empty}</p>
            <p className="text-muted text-sm">{t.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(bookmarksByQuiz).map(([quizId, quizBookmarks]) => {
              const quiz = quizCatalog.find((q) => q.id === quizId);
              const quizTitle = quiz?.title ?? quizId;

              return (
                <div key={quizId} className="bg-card rounded-lg shadow-md overflow-hidden">
                  <div className="px-4 py-3 bg-muted border-b border-default">
                    <h2 className="font-medium text-primary">{quizTitle}</h2>
                  </div>
                  <div className="divide-y divide-default">
                    {quizBookmarks.map((bookmark) => (
                      <div
                        key={`${bookmark.quizId}-${bookmark.questionId}`}
                        className="p-4 hover:bg-hover transition-colors"
                      >
                        <p className="text-primary mb-2 line-clamp-2">
                          {bookmark.questionText}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted">
                            {new Date(bookmark.bookmarkedAt).toLocaleDateString(
                              language === 'de' ? 'de-DE' : 'en-US'
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeBookmark(bookmark.questionId, bookmark.quizId)}
                              className="text-sm text-muted hover:text-error transition-colors"
                            >
                              {t.remove}
                            </button>
                            <button
                              onClick={() => handleGoToQuestion(bookmark.quizId, bookmark.questionId)}
                              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                            >
                              {t.goToQuestion} →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
