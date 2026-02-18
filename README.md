# iSAQB CPSA-F Quiz App

A web application for practicing iSAQB Certified Professional for Software Architecture - Foundation Level (CPSA-F) certification exam questions.

## Features

- **Three question types**: Single choice (A-Fragen), Multiple choice (P-Fragen), Classification matrix (K-Fragen)
- **Exam-style layout**: All questions displayed on one page
- **Immediate feedback**: Check answers with explanations
- **Partial scoring**: Points calculated per iSAQB rules
- **Progress persistence**: Resume where you left off (localStorage)
- **Multiple quiz sets**: Separate progress tracking per quiz
- **Multi-language support**: German and English

## Prerequisites

- Node.js v22.16.0

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Project Structure

```
quiz-app/
├── public/
│   └── data/
│       ├── german/           # German question sets
│       └── english/          # English question sets
├── src/
│   ├── components/
│   │   ├── QuizSelection.tsx
│   │   ├── QuizView.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── SingleChoice.tsx
│   │   ├── MultipleChoice.tsx
│   │   ├── ClassificationMatrix.tsx
│   │   ├── Header.tsx
│   │   └── ScoreSummary.tsx
│   ├── data/
│   │   └── quizCatalog.ts    # Quiz registry
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useQuizProgress.ts
│   │   └── useQuizState.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── scoring.ts
```

## Adding New Quizzes

1. Add your question JSON file to `public/data/german/` or `public/data/english/`
2. Register the quiz in `src/data/quizCatalog.ts`:

```typescript
{
  id: 'de-practice-01',  // pattern: {lang}-{type}-{number}
  filename: 'german/german-questions-1.json',
  title: 'Set 1',
  description: 'Optional description',
  language: 'de', // or 'en'
}
```

## Question JSON Format

```json
{
  "exam_title": "Quiz Title",
  "version": "de-practice-01-v1.0",
  "questions": [
    {
      "id": "de-practice-01-q001",
      "type": "single_choice",
      "points": 1,
      "question_text": "Question?",
      "explanation": "Why the answer is correct...",
      "options": [
        { "id": "a", "text": "Option A", "is_correct": true },
        { "id": "b", "text": "Option B", "is_correct": false }
      ]
    },
    {
      "id": "de-practice-01-q002",
      "type": "multiple_choice",
      "points": 2,
      "question_text": "Select all correct answers:",
      "required_correct_count": 2,
      "options": [...]
    },
    {
      "id": "de-practice-01-q003",
      "type": "classification_matrix",
      "points": 3,
      "question_text": "Classify each item:",
      "column_headers": ["Category A", "Category B"],
      "rows": [
        { "id": "r1", "text": "Item 1", "correct_column_index": 0 }
      ]
    }
  ]
}
```

## Tech Stack

- React 19
- TypeScript 5.9
- Vite 7
- Tailwind CSS 4
