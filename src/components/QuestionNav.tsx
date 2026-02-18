import type { Question, QuestionScore } from '../types';

interface Props {
  questions: Question[];
  scores: Record<string, QuestionScore>;
  onNavigate: (index: number) => void;
  currentIndex?: number;
}

export function QuestionNav({ questions, scores, onNavigate, currentIndex }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {questions.map((q, index) => {
        const score = scores[q.id];
        const isAnswered = score !== undefined;
        const isCorrect = score?.isFullyCorrect ?? null;
        const isCurrent = currentIndex === index;

        let bgClass = 'bg-muted hover:bg-hover';
        if (isAnswered) {
          if (isCorrect) {
            bgClass = 'bg-green-500';
          } else if (isCorrect === false) {
            bgClass = 'bg-red-500';
          } else {
            bgClass = 'bg-yellow-500';
          }
        }

        return (
          <button
            key={q.id}
            onClick={() => onNavigate(index)}
            className={`
              w-5 h-5 md:w-6 md:h-6 rounded-sm flex items-center justify-center
              text-[10px] md:text-xs font-medium transition-all
              ${bgClass} ${isAnswered ? 'text-white' : 'text-secondary'}
              ${isCurrent ? 'ring-2 ring-blue-500' : ''}
            `}
            title={`Frage ${index + 1}`}
            aria-label={`Zu Frage ${index + 1} springen`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
