import type { Language } from '../types';

interface Props {
  earnedPoints: number;
  maxPoints: number;
  onReset: () => void;
  onBack?: () => void;
  incorrectCount?: number;
  onRetryIncorrect?: () => void;
  language?: Language;
}

export function ScoreSummary({
  earnedPoints,
  maxPoints,
  onReset,
  onBack,
  incorrectCount,
  onRetryIncorrect,
  language = 'de',
}: Props) {
  const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;
  const passed = percentage >= 60;

  const labels = {
    de: {
      result: 'Ergebnis',
      pointsOf: 'von',
      points: 'Punkten',
      passed: 'Bestanden',
      failed: 'Nicht bestanden',
      passingNote: 'Zum Bestehen werden mindestens 60% benötigt.',
      toOverview: 'Zur Übersicht',
      restart: 'Neu starten',
      retryIncorrect: 'Falsche wiederholen',
      incorrectQuestions: 'falsche Fragen',
    },
    en: {
      result: 'Result',
      pointsOf: 'of',
      points: 'points',
      passed: 'Passed',
      failed: 'Failed',
      passingNote: 'A minimum of 60% is required to pass.',
      toOverview: 'To Overview',
      restart: 'Restart',
      retryIncorrect: 'Retry Incorrect',
      incorrectQuestions: 'incorrect questions',
    },
  };

  const t = labels[language];

  return (
    <div className="bg-card rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-primary">{t.result}</h2>

      <div
        className={`text-5xl font-bold mb-2 ${
          passed ? 'text-success' : 'text-error'
        }`}
      >
        {percentage.toFixed(1)}%
      </div>

      <div className="text-secondary mb-4">
        {earnedPoints.toFixed(2)} {t.pointsOf} {maxPoints} {t.points}
      </div>

      <div
        className={`inline-block px-4 py-2 rounded-full text-white font-medium mb-6 ${
          passed ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {passed ? t.passed : t.failed}
      </div>

      <p className="text-sm text-muted mb-6">
        {t.passingNote}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 border border-default text-secondary rounded-lg hover:bg-hover transition-colors"
          >
            {t.toOverview}
          </button>
        )}
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t.restart}
        </button>
        {onRetryIncorrect && incorrectCount && incorrectCount > 0 && (
          <button
            onClick={onRetryIncorrect}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t.retryIncorrect} ({incorrectCount})
          </button>
        )}
      </div>
    </div>
  );
}
