// Option for single/multiple choice questions
export interface Option {
  id: string;
  text: string;
  is_correct: boolean;
}

// Row for classification matrix questions
export interface MatrixRow {
  id: string;
  text: string;
  correct_column_index: number;
}

// Base question structure
interface BaseQuestion {
  id: string;
  type: 'single_choice' | 'multiple_choice' | 'classification_matrix';
  points: number;
  question_text: string;
  explanation?: string;
}

// A-Fragen: Single choice question
export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single_choice';
  options: Option[];
}

// P-Fragen: Multiple choice with required count
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: Option[];
  required_correct_count: number;
}

// K-Fragen: Classification matrix
export interface ClassificationMatrixQuestion extends BaseQuestion {
  type: 'classification_matrix';
  column_headers: string[];
  rows: MatrixRow[];
}

export type Question = SingleChoiceQuestion | MultipleChoiceQuestion | ClassificationMatrixQuestion;

// Exam structure
export interface Exam {
  exam_title: string;
  version: string;
  questions: Question[];
}

// Supported languages
export type Language = 'de' | 'en';

// Quiz catalog entry
export interface QuizInfo {
  id: string;
  filename: string;
  title: string;
  description?: string;
  language: Language;
}

// User answers
export interface SingleChoiceAnswer {
  selectedOptionId: string | null;
}

export interface MultipleChoiceAnswer {
  selectedOptionIds: string[];
}

export interface ClassificationMatrixAnswer {
  rowSelections: Record<string, number>; // rowId -> columnIndex
}

export type Answer = SingleChoiceAnswer | MultipleChoiceAnswer | ClassificationMatrixAnswer;

// Quiz state for localStorage
export interface QuizProgress {
  examVersion: string;
  answers: Record<string, Answer>;
  startedAt: string;
  lastUpdatedAt: string;
  totalQuestions: number;
  maxPoints: number;
}

// Scoring result for a question
export interface QuestionScore {
  earnedPoints: number;
  maxPoints: number;
  isFullyCorrect: boolean;
}

// User preferences
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
}
