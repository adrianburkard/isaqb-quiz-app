import type { ClassificationMatrixQuestion, ClassificationMatrixAnswer } from '../types';

interface Props {
  question: ClassificationMatrixQuestion;
  answer: ClassificationMatrixAnswer;
  onAnswer: (answer: ClassificationMatrixAnswer) => void;
  showFeedback: boolean;
}

export function ClassificationMatrix({ question, answer, onAnswer, showFeedback }: Props) {
  const rowSelections = answer.rowSelections;

  const handleCellChange = (rowId: string, columnIndex: number) => {
    if (showFeedback) return;

    const newSelections = {
      ...rowSelections,
      [rowId]: columnIndex,
    };

    onAnswer({ rowSelections: newSelections });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-strong p-3 bg-muted text-left min-w-50 text-primary">
              Aussage
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
}
