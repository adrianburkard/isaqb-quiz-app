import type { QuizAttempt } from '../types/history';
import type { Language, Question } from '../types';

interface Props {
  attempt: QuizAttempt;
  language: Language;
  onBack: () => void;
}

const typeLabels: Record<Language, Record<Question['type'], string>> = {
  de: {
    single_choice: 'A-Frage',
    multiple_choice: 'P-Frage',
    classification_matrix: 'K-Frage',
  },
  en: {
    single_choice: 'Single',
    multiple_choice: 'Multiple',
    classification_matrix: 'Matrix',
  },
};

export function AttemptDetail({ attempt, language, onBack }: Props) {
  const labels = {
    de: {
      back: 'Zurück',
      passed: 'Bestanden',
      failed: 'Nicht bestanden',
      practice: 'Übungsmodus',
      exam: 'Prüfungsmodus',
      duration: 'Dauer',
      score: 'Punkte',
      questions: 'Fragen',
      correct: 'Richtig',
      partial: 'Teilweise',
      incorrect: 'Falsch',
      timeSpent: 'Zeit',
      questionResults: 'Ergebnisse nach Frage',
    },
    en: {
      back: 'Back',
      passed: 'Passed',
      failed: 'Failed',
      practice: 'Practice Mode',
      exam: 'Exam Mode',
      duration: 'Duration',
      score: 'Score',
      questions: 'Questions',
      correct: 'Correct',
      partial: 'Partial',
      incorrect: 'Incorrect',
      timeSpent: 'Time',
      questionResults: 'Results by Question',
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const correctCount = attempt.questionResults.filter((r) => r.isCorrect).length;
  const partialCount = attempt.questionResults.filter((r) => !r.isCorrect && r.earnedPoints > 0).length;
  const incorrectCount = attempt.questionResults.filter((r) => r.earnedPoints === 0).length;

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
              <h1 className="text-xl font-bold text-primary">{attempt.quizTitle}</h1>
              <p className="text-secondary text-sm">{formatDate(attempt.completedAt)}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              attempt.passed
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {attempt.passed ? t.passed : t.failed}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${
                attempt.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {attempt.percentage}%
              </div>
              <div className="text-xs text-secondary">{t.score}</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {attempt.earnedPoints}/{attempt.maxPoints}
              </div>
              <div className="text-xs text-secondary">{t.questions}</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {formatDuration(attempt.durationMs)}
              </div>
              <div className="text-xs text-secondary">{t.duration}</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary">
                {attempt.mode === 'exam' ? t.exam : t.practice}
              </div>
              <div className="text-xs text-secondary invisible">-</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Summary */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-secondary">{t.correct}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{partialCount}</div>
              <div className="text-sm text-secondary">{t.partial}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-secondary">{t.incorrect}</div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <h2 className="font-medium text-primary mb-4">{t.questionResults}</h2>
        <div className="space-y-2">
          {attempt.questionResults.map((result, index) => {
            let statusColor = 'bg-red-500';
            if (result.isCorrect) {
              statusColor = 'bg-green-500';
            } else if (result.earnedPoints > 0) {
              statusColor = 'bg-yellow-500';
            }

            return (
              <div
                key={result.questionId}
                className="bg-card rounded-lg shadow-sm p-3 flex items-center gap-3"
              >
                <div className={`w-2 h-8 rounded-full ${statusColor}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">
                      {language === 'de' ? 'Frage' : 'Q'} {index + 1}
                    </span>
                    <span className="px-1.5 py-0.5 bg-muted text-secondary text-xs rounded">
                      {typeLabels[language][result.questionType]}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    result.isCorrect
                      ? 'text-green-600'
                      : result.earnedPoints > 0
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}>
                    {result.earnedPoints}/{result.maxPoints}
                  </div>
                  <div className="text-xs text-muted">
                    {formatDuration(result.timeSpentMs)}
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
