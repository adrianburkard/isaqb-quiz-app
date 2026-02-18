import type { Question, QuestionScore } from '../types';

interface Props {
  questions: Question[];
  scores: Record<string, QuestionScore>;
  onNavigate: (index: number) => void;
  currentIndex?: number;
  flaggedQuestions?: Set<string>;
  showFeedback?: boolean; // In exam mode, only show correct/incorrect after reveal
}

export function QuestionNav({
  questions,
  scores,
  onNavigate,
  currentIndex,
  flaggedQuestions,
  showFeedback = true,
}: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {questions.map((q, index) => {
        const score = scores[q.id];
        const isAnswered = score !== undefined;
        const isCorrect = score?.isFullyCorrect ?? null;
        const isCurrent = currentIndex === index;
        const isFlagged = flaggedQuestions?.has(q.id) ?? false;

        let bgClass = 'bg-muted hover:bg-hover';
        if (isAnswered) {
          if (showFeedback) {
            if (isCorrect) {
              bgClass = 'bg-green-500';
            } else if (isCorrect === false) {
              bgClass = 'bg-red-500';
            } else {
              bgClass = 'bg-yellow-500';
            }
          } else {
            // Exam mode before reveal - just show as answered
            bgClass = 'bg-blue-500';
          }
        }

        return (
          <button
            key={q.id}
            onClick={() => onNavigate(index)}
            className={`
              relative w-5 h-5 md:w-6 md:h-6 rounded-sm flex items-center justify-center
              text-[10px] md:text-xs font-medium transition-all
              ${bgClass} ${isAnswered ? 'text-white' : 'text-secondary'}
              ${isCurrent ? 'ring-2 ring-blue-500' : ''}
            `}
            title={`Frage ${index + 1}${isFlagged ? ' (markiert)' : ''}`}
            aria-label={`Zu Frage ${index + 1} springen${isFlagged ? ' (markiert zur Überprüfung)' : ''}`}
          >
            {index + 1}
            {isFlagged && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white dark:border-gray-800" />
            )}
          </button>
        );
      })}
    </div>
  );
}
