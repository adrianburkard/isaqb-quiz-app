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

        let bgClass = 'bg-input hover:bg-hover';
        let borderClass = 'border-default';

        if (showFeedback) {
          if (option.is_correct) {
            bgClass = 'bg-success';
            borderClass = 'border-success';
          } else if (isSelected) {
            bgClass = 'bg-error';
            borderClass = 'border-error';
          }
        } else if (isSelected) {
          bgClass = 'bg-info';
          borderClass = 'border-info';
        }

        return (
          <label
            key={option.id}
            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors text-primary ${bgClass} ${borderClass} ${showFeedback ? 'cursor-default' : ''}`}
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
              <span className="ml-2 text-success font-medium">Richtig</span>
            )}
          </label>
        );
      })}
    </div>
  );
}
