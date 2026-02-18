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

        let bgClass = 'bg-white hover:bg-gray-50';
        let borderClass = 'border-gray-200';

        if (showFeedback) {
          if (option.is_correct) {
            bgClass = 'bg-green-50';
            borderClass = 'border-green-500';
          } else if (isSelected) {
            bgClass = 'bg-red-50';
            borderClass = 'border-red-500';
          }
        } else if (isSelected) {
          bgClass = 'bg-blue-50';
          borderClass = 'border-blue-500';
        }

        return (
          <label
            key={option.id}
            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${bgClass} ${borderClass} ${showFeedback ? 'cursor-default' : ''}`}
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
              <span className="ml-2 text-green-600 font-medium">Richtig</span>
            )}
          </label>
        );
      })}
    </div>
  );
}
