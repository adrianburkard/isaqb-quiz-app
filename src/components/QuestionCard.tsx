import { useState } from 'react';
import type {
  Question,
  Answer,
  SingleChoiceAnswer,
  MultipleChoiceAnswer,
  ClassificationMatrixAnswer,
  QuestionScore,
} from '../types';
import { SingleChoice } from './SingleChoice';
import { MultipleChoice } from './MultipleChoice';
import { ClassificationMatrix } from './ClassificationMatrix';

interface Props {
  question: Question;
  questionNumber: number;
  submittedAnswer: Answer | null;
  score: QuestionScore | null;
  onSubmit: (answer: Answer) => void;
}

function getInitialAnswer(question: Question): Answer {
  switch (question.type) {
    case 'single_choice':
      return { selectedOptionId: null };
    case 'multiple_choice':
      return { selectedOptionIds: [] };
    case 'classification_matrix':
      return { rowSelections: {} };
  }
}

function isAnswerComplete(question: Question, answer: Answer): boolean {
  switch (question.type) {
    case 'single_choice':
      return (answer as SingleChoiceAnswer).selectedOptionId !== null;
    case 'multiple_choice':
      return (answer as MultipleChoiceAnswer).selectedOptionIds.length > 0;
    case 'classification_matrix': {
      const matrixAnswer = answer as ClassificationMatrixAnswer;
      return Object.keys(matrixAnswer.rowSelections).length === question.rows.length;
    }
  }
}

export function QuestionCard({
  question,
  questionNumber,
  submittedAnswer,
  score,
  onSubmit,
}: Props) {
  const isSubmitted = score !== null;
  const [draftAnswer, setDraftAnswer] = useState<Answer>(() =>
    submittedAnswer ?? getInitialAnswer(question)
  );

  const currentAnswer = isSubmitted ? submittedAnswer! : draftAnswer;
  const canSubmit = !isSubmitted && isAnswerComplete(question, draftAnswer);

  let borderColor = 'border-l-gray-300';
  if (isSubmitted) {
    if (score.isFullyCorrect) {
      borderColor = 'border-l-green-500';
    } else if (score.earnedPoints > 0) {
      borderColor = 'border-l-yellow-500';
    } else {
      borderColor = 'border-l-red-500';
    }
  }

  const handleAnswerChange = (answer: Answer) => {
    if (!isSubmitted) {
      setDraftAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(draftAnswer);
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'single_choice':
        return (
          <SingleChoice
            question={question}
            answer={currentAnswer as SingleChoiceAnswer}
            onAnswer={handleAnswerChange}
            showFeedback={isSubmitted}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoice
            question={question}
            answer={currentAnswer as MultipleChoiceAnswer}
            onAnswer={handleAnswerChange}
            showFeedback={isSubmitted}
          />
        );
      case 'classification_matrix':
        return (
          <ClassificationMatrix
            question={question}
            answer={currentAnswer as ClassificationMatrixAnswer}
            onAnswer={handleAnswerChange}
            showFeedback={isSubmitted}
          />
        );
    }
  };

  const typeLabels: Record<Question['type'], string> = {
    single_choice: 'A-Frage',
    multiple_choice: 'P-Frage',
    classification_matrix: 'K-Frage',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-700">
            Frage {questionNumber}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            {typeLabels[question.type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isSubmitted && (
            <span
              className={`font-medium ${
                score.isFullyCorrect
                  ? 'text-green-600'
                  : score.earnedPoints > 0
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {score.earnedPoints} / {score.maxPoints} Punkte
            </span>
          )}
          {!isSubmitted && (
            <span className="text-gray-500 text-sm">
              {question.points} {question.points === 1 ? 'Punkt' : 'Punkte'}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-800 mb-4 font-medium">{question.question_text}</p>

      {renderQuestion()}

      {isSubmitted && question.explanation && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex gap-2">
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-green-800 mb-1">Erklärung</p>
              <p className="text-green-700 text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {!isSubmitted && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              canSubmit
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Antwort prufen
          </button>
        </div>
      )}
    </div>
  );
}
