import { useTranslation } from '../i18n';
import type { ClassificationMatrixQuestion, ClassificationMatrixAnswer, Language } from '../types';

interface Props {
  question: ClassificationMatrixQuestion;
  answer: ClassificationMatrixAnswer;
  onAnswer: (answer: ClassificationMatrixAnswer) => void;
  showFeedback: boolean;
  language?: Language;
}

export function ClassificationMatrix({ question, answer, onAnswer, showFeedback, language = 'de' }: Props) {
  const { section } = useTranslation(language);
  const t = section('classificationMatrix');
  const rowSelections = answer.rowSelections;

  const handleCellChange = (rowId: string, columnIndex: number) => {
    if (showFeedback) return;

    const newSelections = {
      ...rowSelections,
      [rowId]: columnIndex,
    };

    onAnswer({ rowSelections: newSelections });
  };

  // Mobile card layout
  const renderMobileLayout = () => (
    <div className="space-y-4 md:hidden">
      {question.rows.map((row) => {
        const selectedCol = rowSelections[row.id];
        const isCorrect = selectedCol === row.correct_column_index;

        let cardBgClass = 'bg-card border-default';
        if (showFeedback && selectedCol !== undefined) {
          cardBgClass = isCorrect ? 'bg-success border-success' : 'bg-error border-error';
        }

        return (
          <div key={row.id} className={`p-4 rounded-lg border ${cardBgClass}`}>
            <p className="text-primary font-medium mb-3">{row.text}</p>
            <div className="flex flex-wrap gap-2">
              {question.column_headers.map((header, colIndex) => {
                const isSelected = selectedCol === colIndex;
                const isCorrectColumn = row.correct_column_index === colIndex;

                let btnClass = 'bg-muted text-secondary border-default';
                if (isSelected) {
                  btnClass = 'bg-blue-500 text-white border-blue-500';
                }
                if (showFeedback && isCorrectColumn) {
                  btnClass = 'bg-green-500 text-white border-green-500';
                } else if (showFeedback && isSelected && !isCorrectColumn) {
                  btnClass = 'bg-red-500 text-white border-red-500';
                }

                return (
                  <button
                    key={colIndex}
                    type="button"
                    onClick={() => handleCellChange(row.id, colIndex)}
                    disabled={showFeedback}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${btnClass} ${showFeedback ? 'cursor-default' : ''}`}
                  >
                    {header}
                    {showFeedback && isCorrectColumn && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Desktop table layout
  const renderTableLayout = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-strong p-3 bg-muted text-left min-w-50 text-primary">
              {t.statement}
            </th>
            {question.column_headers.map((header, index) => (
              <th
                key={index}
                className="border border-strong p-3 bg-muted text-center min-w-30 text-primary"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.rows.map((row) => {
            const selectedCol = rowSelections[row.id];
            const isCorrect = selectedCol === row.correct_column_index;

            let rowBgClass = 'bg-card';
            if (showFeedback && selectedCol !== undefined) {
              rowBgClass = isCorrect ? 'bg-success' : 'bg-error';
            }

            return (
              <tr key={row.id} className={rowBgClass}>
                <td className="border border-strong p-3 text-primary">{row.text}</td>
                {question.column_headers.map((_header, colIndex) => {
                  const isSelected = selectedCol === colIndex;
                  const isCorrectColumn = row.correct_column_index === colIndex;

                  return (
                    <td
                      key={colIndex}
                      className="border border-strong p-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="radio"
                          name={`${question.id}-${row.id}`}
                          checked={isSelected}
                          onChange={() => handleCellChange(row.id, colIndex)}
                          disabled={showFeedback}
                          className="w-4 h-4 text-blue-600"
                        />
                        {showFeedback && isCorrectColumn && (
                          <span className="text-success font-bold">✓</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {renderMobileLayout()}
      {renderTableLayout()}
    </>
  );
}
