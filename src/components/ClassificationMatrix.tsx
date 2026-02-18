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
            <th className="border border-gray-300 p-3 bg-gray-50 text-left min-w-[200px]">
              Aussage
            </th>
            {question.column_headers.map((header, index) => (
              <th
                key={index}
                className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]"
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

            let rowBgClass = '';
            if (showFeedback && selectedCol !== undefined) {
              rowBgClass = isCorrect ? 'bg-green-50' : 'bg-red-50';
            }

            return (
              <tr key={row.id} className={rowBgClass}>
                <td className="border border-gray-300 p-3">{row.text}</td>
                {question.column_headers.map((_, colIndex) => {
                  const isSelected = selectedCol === colIndex;
                  const isCorrectColumn = row.correct_column_index === colIndex;

                  return (
                    <td
                      key={colIndex}
                      className="border border-gray-300 p-3 text-center"
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
                          <span className="text-green-600 font-bold">✓</span>
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
