import { useTranslation } from '../i18n';
import type { MultipleChoiceQuestion, MultipleChoiceAnswer, Language } from '../types';

interface Props {
  question: MultipleChoiceQuestion;
  answer: MultipleChoiceAnswer;
  onAnswer: (answer: MultipleChoiceAnswer) => void;
  showFeedback: boolean;
  language?: Language;
}

export function MultipleChoice({ question, answer, onAnswer, showFeedback, language = 'de' }: Props) {
  const { t, section } = useTranslation(language);
  const common = section('common');
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
      <p className="text-sm text-secondary mb-3">
        {t('multipleChoice.selectCount', { count: question.required_correct_count })}
      </p>
      {question.options.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        let bgClass = 'bg-input hover:bg-hover';
        let borderClass = 'border-default';

        if (showFeedback) {
          if (option.is_correct && isSelected) {
            bgClass = 'bg-success';
            borderClass = 'border-success';
          } else if (option.is_correct && !isSelected) {
            bgClass = 'bg-warning';
            borderClass = 'border-warning';
          } else if (!option.is_correct && isSelected) {
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
              type="checkbox"
              checked={isSelected}
              onChange={(e) => handleChange(option.id, e.target.checked)}
              disabled={showFeedback}
              className="w-4 h-4 text-blue-600 mr-3 rounded"
            />
            <span className="flex-1">{option.text}</span>
            {showFeedback && option.is_correct && (
              <span className="ml-2 text-success font-medium">{common.correct}</span>
            )}
            {showFeedback && !option.is_correct && isSelected && (
              <span className="ml-2 text-error font-medium">{common.incorrect}</span>
            )}
          </label>
        );
      })}
    </div>
  );
}
