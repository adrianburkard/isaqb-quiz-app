interface Props {
  earnedPoints: number;
  maxPoints: number;
  onReset: () => void;
  onBack?: () => void;
}

export function ScoreSummary({ earnedPoints, maxPoints, onReset, onBack }: Props) {
  const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;
  const passed = percentage >= 60;

  return (
    <div className="bg-card rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-primary">Ergebnis</h2>

      <div
        className={`text-5xl font-bold mb-2 ${
          passed ? 'text-success' : 'text-error'
        }`}
      >
        {percentage.toFixed(1)}%
      </div>

      <div className="text-secondary mb-4">
        {earnedPoints.toFixed(2)} von {maxPoints} Punkten
      </div>

      <div
        className={`inline-block px-4 py-2 rounded-full text-white font-medium mb-6 ${
          passed ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {passed ? 'Bestanden' : 'Nicht bestanden'}
      </div>

      <p className="text-sm text-muted mb-6">
        Zum Bestehen werden mindestens 60% benötigt.
      </p>

      <div className="flex justify-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 border border-default text-secondary rounded-lg hover:bg-hover transition-colors"
          >
            Zur Übersicht
          </button>
        )}
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Neu starten
        </button>
      </div>
    </div>
  );
}
