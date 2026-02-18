interface Props {
  title: string;
  answeredCount: number;
  totalCount: number;
  earnedPoints: number;
  maxPoints: number;
  showScore: boolean;
  onBack?: () => void;
}

export function Header({
  title,
  answeredCount,
  totalCount,
  earnedPoints,
  maxPoints,
  showScore,
  onBack,
}: Props) {
  const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Zurück zur Übersicht"
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
          )}
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {answeredCount} / {totalCount} beantwortet
            </span>
            {showScore && (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {earnedPoints.toFixed(2)} / {maxPoints} Punkte
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
