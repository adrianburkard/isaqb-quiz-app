import type { SingleChoiceQuestion, SingleChoiceAnswer } from '../types';

interface Props {
  question: SingleChoiceQuestion;
  answer: SingleChoiceAnswer;
  onAnswer: (answer: SingleChoiceAnswer) => void;
  showFeedback: boolean;
}

export function SingleChoice({ question, answer, onAnswer, showFeedback }: Props) {
  const handleChange = (optionId: string) => {
    if (showFeedback) return;
    onAnswer({ selectedOptionId: optionId });
  };

  return (
    <div className="space-y-2">
      {question.options.map((option) => {
        const isSelected = answer.selectedOptionId === option.id;

        let bgClass = 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
        let borderClass = 'border-gray-200 dark:border-gray-600';
        let textClass = 'text-gray-800 dark:text-gray-200';

        if (showFeedback) {
          if (option.is_correct) {
            bgClass = 'bg-green-50 dark:bg-green-900/40';
            borderClass = 'border-green-500';
            textClass = 'text-gray-800 dark:text-gray-100';
          } else if (isSelected) {
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
              type="radio"
              name={question.id}
              checked={isSelected}
              onChange={() => handleChange(option.id)}
              disabled={showFeedback}
              className="w-4 h-4 text-blue-600 mr-3"
            />
            <span className="flex-1">{option.text}</span>
            {showFeedback && option.is_correct && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">Richtig</span>
            )}
          </label>
        );
      })}
    </div>
  );
}
