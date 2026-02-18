import type {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  ClassificationMatrixQuestion,
  SingleChoiceAnswer,
  MultipleChoiceAnswer,
  ClassificationMatrixAnswer,
  QuestionScore,
  Question,
  Answer,
} from '../types';

export function scoreSingleChoice(
  question: SingleChoiceQuestion,
  answer: SingleChoiceAnswer
): QuestionScore {
  const selectedOption = question.options.find(
    (o) => o.id === answer.selectedOptionId
  );
  const isCorrect = selectedOption?.is_correct ?? false;

  return {
    earnedPoints: isCorrect ? question.points : 0,
    maxPoints: question.points,
    isFullyCorrect: isCorrect,
  };
}

export function scoreMultipleChoice(
  question: MultipleChoiceQuestion,
  answer: MultipleChoiceAnswer
): QuestionScore {
  const totalOptions = question.options.length;
  const pointsPerOption = question.points / totalOptions;

  let earnedPoints = 0;

  question.options.forEach((option) => {
    const isSelected = answer.selectedOptionIds.includes(option.id);
    const shouldBeSelected = option.is_correct;

    if (isSelected === shouldBeSelected) {
      // Correct decision (selected correct or didn't select incorrect)
      earnedPoints += pointsPerOption;
    } else {
      // Wrong decision
      earnedPoints -= pointsPerOption;
    }
  });

  // Floor at 0
  earnedPoints = Math.max(0, earnedPoints);
  // Round to 2 decimal places
  earnedPoints = Math.round(earnedPoints * 100) / 100;

  const correctOptions = question.options.filter((o) => o.is_correct);
  const allCorrectSelected = correctOptions.every((o) =>
    answer.selectedOptionIds.includes(o.id)
  );
  const noIncorrectSelected = answer.selectedOptionIds.every(
    (id) => question.options.find((o) => o.id === id)?.is_correct
  );

  return {
    earnedPoints,
    maxPoints: question.points,
    isFullyCorrect: allCorrectSelected && noIncorrectSelected,
  };
}

export function scoreClassificationMatrix(
  question: ClassificationMatrixQuestion,
  answer: ClassificationMatrixAnswer
): QuestionScore {
  const totalRows = question.rows.length;
  const pointsPerRow = question.points / totalRows;

  let earnedPoints = 0;
  let correctRows = 0;

  question.rows.forEach((row) => {
    const selectedColumnIndex = answer.rowSelections[row.id];
    const isCorrect = selectedColumnIndex === row.correct_column_index;

    if (isCorrect) {
      earnedPoints += pointsPerRow;
      correctRows++;
    } else if (selectedColumnIndex !== undefined) {
      // Answered but wrong
      earnedPoints -= pointsPerRow;
    }
  });

  earnedPoints = Math.max(0, earnedPoints);
  earnedPoints = Math.round(earnedPoints * 100) / 100;

  return {
    earnedPoints,
    maxPoints: question.points,
    isFullyCorrect: correctRows === totalRows,
  };
}

export function scoreQuestion(question: Question, answer: Answer): QuestionScore {
  switch (question.type) {
    case 'single_choice':
      return scoreSingleChoice(
        question,
        answer as SingleChoiceAnswer
      );
    case 'multiple_choice':
      return scoreMultipleChoice(
        question,
        answer as MultipleChoiceAnswer
      );
    case 'classification_matrix':
      return scoreClassificationMatrix(
        question,
        answer as ClassificationMatrixAnswer
      );
  }
}
