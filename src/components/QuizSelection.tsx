import { quizCatalog } from '../data/quizCatalog';
import { useAllQuizProgress, clearQuizProgress } from '../hooks/useQuizProgress';
import type { QuizInfo } from '../types';

interface Props {
  onSelectQuiz: (quiz: QuizInfo) => void;
}

export function QuizSelection({ onSelectQuiz }: Props) {
  const { summaries, refresh } = useAllQuizProgress();

  const handleReset = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Fortschritt für dieses Quiz wirklich löschen?')) {
      clearQuizProgress(quizId);
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            iSAQB CPSA-F Übungsprüfungen
          </h1>
          <p className="text-gray-600 mt-1">
            Wähle ein Quiz aus, um zu beginnen oder fortzufahren.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-4">
          {quizCatalog.map((quiz) => {
            const progress = summaries.find((s) => s.quizId === quiz.id);
            const hasProgress = progress && progress.answeredCount > 0;
            const isComplete = progress && progress.answeredCount === progress.totalQuestions && progress.totalQuestions > 0;

            return (
              <div
                key={quiz.id}
                onClick={() => onSelectQuiz(quiz)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {quiz.title}
                    </h2>
                    {quiz.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {quiz.description}
                      </p>
                    )}

                    {hasProgress && (
                      <div className="mt-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            {progress.answeredCount} / {progress.totalQuestions} beantwortet
                          </span>
                          {isComplete && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Abgeschlossen
                            </span>
                          )}
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!hasProgress && (
                      <p className="mt-3 text-sm text-gray-500">
                        Noch nicht gestartet
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {hasProgress && (
                      <button
                        onClick={(e) => handleReset(quiz.id, e)}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Quiz neu starten"
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
