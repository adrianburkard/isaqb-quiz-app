import type { MultipleChoiceQuestion, MultipleChoiceAnswer } from '../types';

interface Props {
  question: MultipleChoiceQuestion;
  answer: MultipleChoiceAnswer;
  onAnswer: (answer: MultipleChoiceAnswer) => void;
  showFeedback: boolean;
}

export function MultipleChoice({ question, answer, onAnswer, showFeedback }: Props) {
  const selectedIds = answer.selectedOptionIds;

  const handleChange = (optionId: string, checked: boolean) => {
    if (showFeedback) return;

    const newSelection = checked
      ? [...selectedIds, optionId]
      : selectedIds.filter((id) => id !== optionId);

    onAnswer({ selectedOptionIds: newSelection });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Wahlen Sie {question.required_correct_count} Antworten aus.
      </p>
      {question.options.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        let bgClass = 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
        let borderClass = 'border-gray-200 dark:border-gray-600';
        let textClass = 'text-gray-800 dark:text-gray-200';

        if (showFeedback) {
          if (option.is_correct && isSelected) {
            bgClass = 'bg-green-50 dark:bg-green-900/40';
            borderClass = 'border-green-500';
            textClass = 'text-gray-800 dark:text-gray-100';
          } else if (option.is_correct && !isSelected) {
            bgClass = 'bg-yellow-50 dark:bg-yellow-900/40';
            borderClass = 'border-yellow-500';
            textClass = 'text-gray-800 dark:text-gray-100';
          } else if (!option.is_correct && isSelected) {
            bgClass = 'bg-red-50 dark:bg-red-900/40';
            borderClass = 'border-red-500';
            textClass = 'text-gray-800 dark:text-gray-100';
          }
        } else if (isSelected) {
          bgClass = 'bg-blue-50 dark:bg-blue-900/40';
          borderClass = 'border-blue-500';
          textClass = 'text-gray-800 dark:text-gray-100';
        }

        return (
          <label
            key={option.id}
            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${bgClass} ${borderClass} ${textClass} ${showFeedback ? 'cursor-default' : ''}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => handleChange(option.id, e.target.checked)}
              disabled={showFeedback}
              className="w-4 h-4 text-blue-600 mr-3 rounded"
            />
            <span className="flex-1">{option.text}</span>
            {showFeedback && option.is_correct && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">Richtig</span>
            )}
            {showFeedback && !option.is_correct && isSelected && (
              <span className="ml-2 text-red-600 dark:text-red-400 font-medium">Falsch</span>
            )}
          </label>
        );
      })}
    </div>
  );
}
