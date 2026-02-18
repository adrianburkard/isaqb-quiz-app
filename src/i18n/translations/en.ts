export const en = {
  // Common strings used across multiple components
  common: {
    back: 'Back',
    cancel: 'Cancel',
    delete: 'Delete',
    remove: 'Remove',
    restart: 'Restart',
    start: 'Start',
    save: 'Save',
    loading: 'Loading...',
    error: 'Error',
    points: 'points',
    of: 'of',
    question: 'Question',
    questions: 'questions',
    correct: 'Correct',
    incorrect: 'Incorrect',
    partial: 'Partial',
    answered: 'Answered',
    backToOverview: 'Back to Overview',
  },

  // Quiz Selection screen
  quizSelection: {
    title: 'iSAQB CPSA-F Practice Exams',
    subtitle: 'Select a quiz to start or continue.',
    answered: 'answered',
    completed: 'Completed',
    notStarted: 'Not started yet',
    resetTitle: 'Reset quiz',
    bookmarks: 'Bookmarks',
    history: 'History',
    reviews: 'Reviews',
    confirmReset: 'Reset progress for this quiz?',
  },

  // Quiz Setup modal
  quizSetup: {
    title: 'Quiz Settings',
    questionCount: '{count} questions',
    modeLabel: 'Mode',
    practiceMode: 'Practice Mode',
    practiceDesc: 'Immediate feedback after each question',
    examMode: 'Exam Mode',
    examDesc: 'Feedback only at the end',
    timerLabel: 'Time Limit',
    timerEnabled: 'With time limit',
    timerDisabled: 'No time limit',
    minutes: 'minutes',
    orderLabel: 'Question Order',
    sequential: 'Original order',
    random: 'Random order',
    start: 'Start Quiz',
  },

  // Quiz View
  quizView: {
    loadingExam: 'Loading exam...',
    noExamData: 'No exam data found.',
    examModeInfo: 'Exam Mode: Feedback will be shown after submission',
    submitExam: 'Submit Exam',
    submitEarly: 'Submit Early',
    confirmSubmit: 'Do you want to submit the exam? Your answers will be evaluated.',
    confirmRestart: 'Do you want to restart? Your progress will be deleted.',
  },

  // Question Card
  questionCard: {
    question: 'Question',
    explanation: 'Explanation',
    checkAnswer: 'Check Answer',
    save: 'Save',
    pointsDisplay: '{earned} / {max} Points',
  },

  // Question type labels
  questionTypes: {
    single_choice: 'Type A',
    multiple_choice: 'Type P',
    classification_matrix: 'Type K',
    single_choice_long: 'Type A (Single Choice)',
    multiple_choice_long: 'Type P (Multiple Choice)',
    classification_matrix_long: 'Type K (Classification)',
  },

  // Multiple Choice
  multipleChoice: {
    selectCount: 'Select {count} answers.',
  },

  // Classification Matrix
  classificationMatrix: {
    statement: 'Statement',
  },

  // Score Summary
  scoreSummary: {
    result: 'Result',
    passed: 'Passed',
    failed: 'Failed',
    passingNote: 'A minimum of 60% is required to pass.',
    toOverview: 'To Overview',
    retryIncorrect: 'Retry Incorrect',
  },

  // Header
  header: {
    backToOverview: 'Back to overview',
    hideNav: 'Hide navigation',
    showNav: 'Show navigation',
  },

  // Timer
  timer: {
    pause: 'Pause timer',
    resume: 'Resume timer',
  },

  // Flag button
  flag: {
    remove: 'Remove flag',
    add: 'Flag for review',
  },

  // Bookmark button
  bookmark: {
    remove: 'Remove bookmark',
    add: 'Add bookmark',
  },

  // Question navigation
  questionNav: {
    jumpTo: 'Jump to Question {num}',
    flagged: 'flagged',
    flaggedForReview: 'flagged for review',
  },

  // Back to top
  backToTop: 'Back to top',

  // Bookmarked Questions view
  bookmarks: {
    title: 'Bookmarks',
    subtitle: 'Saved questions for review',
    empty: 'No bookmarks yet',
    emptyHint: 'Mark questions with the bookmark icon to save them here.',
    clearAll: 'Clear all',
    goToQuestion: 'Go to question',
    fromQuiz: 'from',
    confirmClearAll: 'Remove all bookmarks?',
  },

  // History view
  history: {
    title: 'History',
    subtitle: 'Your past attempts',
    empty: 'No attempts yet',
    emptyHint: 'Complete a quiz to see your progress here.',
    clearAll: 'Clear history',
    view: 'Details',
    practice: 'Practice',
    exam: 'Exam',
    duration: 'Duration',
    stats: 'Statistics by Question Type',
    best: 'Best',
    average: 'Average',
    attempts: 'attempts',
    confirmClearAll: 'Delete all history?',
    confirmDelete: 'Delete this attempt?',
    passed: 'Passed',
    failed: 'Failed',
    score: 'Score',
  },

  // Attempt Detail view
  attemptDetail: {
    back: 'Back',
    passed: 'Passed',
    failed: 'Failed',
    practice: 'Practice Mode',
    exam: 'Exam Mode',
    duration: 'Duration',
    score: 'Score',
    questions: 'Questions',
    correct: 'Correct',
    partial: 'Partial',
    incorrect: 'Incorrect',
    timeSpent: 'Time',
    questionResults: 'Results by Question',
  },

  // Type Breakdown
  typeBreakdown: {
    correct: 'Correct',
    partial: 'Partial',
    incorrect: 'Incorrect',
    avgTime: 'Avg Time',
    accuracy: 'Accuracy',
  },

  // Spaced Repetition view
  spacedRepetition: {
    title: 'Reviews',
    subtitle: 'Due questions based on spaced repetition',
    noDue: 'No reviews due',
    noDueDesc: 'Answer questions in quizzes to schedule reviews.',
    overdue: 'overdue',
    dueToday: 'due today',
    totalDue: 'total due',
    startReview: 'Start Review',
    stats: 'Statistics',
    mastered: 'Mastered',
    learning: 'Learning',
    newOrReset: 'New/Reset',
    total: 'Total',
    avgEase: 'Average Ease',
    clearAll: 'Clear All Data',
    confirmClear: 'Delete all learning progress?',
  },

  // Focus Mode Setup
  focusMode: {
    title: 'Focus Mode',
    subtitle: 'Choose which questions to review',
    incorrectLabel: 'Incorrect Questions',
    incorrectDesc: 'Questions answered incorrectly in the last attempt',
    flaggedLabel: 'Flagged Questions',
    flaggedDesc: 'Questions you flagged for review',
    bookmarkedLabel: 'Bookmarked Questions',
    bookmarkedDesc: 'Questions you bookmarked',
    customLabel: 'Custom',
    customDesc: 'Select specific categories',
    noQuestions: 'No questions available',
  },

  // Preferences panel
  preferences: {
    settings: 'Settings',
    theme: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
} as const;

// Helper type to convert literal string types to string
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<typeof en>;
