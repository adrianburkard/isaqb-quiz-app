import { useQuizState } from '../hooks/useQuizState';
import { Header } from './Header';
import { QuestionCard } from './QuestionCard';
import { ScoreSummary } from './ScoreSummary';
import type { QuizInfo } from '../types';

interface Props {
  quizInfo: QuizInfo;
  onBack: () => void;
}

export function QuizView({ quizInfo, onBack }: Props) {
  const {
    exam,
    answers,
    scores,
    isLoading,
    error,
    submitAnswer,
    resetQuiz,
    resetKey,
    stats,
  } = useQuizState(quizInfo);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Lade Prüfung...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">Fehler: {error}</div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Keine Prüfungsdaten gefunden.</div>
      </div>
    );
  }

  const isComplete = stats.answeredCount === stats.totalQuestions;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header
        title={exam.exam_title}
        answeredCount={stats.answeredCount}
        totalCount={stats.totalQuestions}
        earnedPoints={stats.earnedPoints}
        maxPoints={stats.maxPoints}
        showScore={stats.answeredCount > 0}
        onBack={onBack}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {isComplete && (
          <div className="mb-6">
            <ScoreSummary
              earnedPoints={stats.earnedPoints}
              maxPoints={stats.maxPoints}
              onReset={resetQuiz}
              onBack={onBack}
            />
          </div>
        )}

        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <QuestionCard
              key={`${question.id}-${resetKey}`}
              question={question}
              questionNumber={index + 1}
              submittedAnswer={answers[question.id] ?? null}
              score={scores[question.id] ?? null}
              onSubmit={(answer) => submitAnswer(question.id, answer)}
            />
          ))}
        </div>

        {!isComplete && stats.answeredCount > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Zurück zur Übersicht
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Möchten Sie wirklich neu starten? Ihr Fortschritt wird gelöscht.'
                  )
                ) {
                  resetQuiz();
                }
              }}
              className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              Neu starten
            </button>
          </div>
        )}

        {!isComplete && stats.answeredCount === 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Zurück zur Übersicht
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
