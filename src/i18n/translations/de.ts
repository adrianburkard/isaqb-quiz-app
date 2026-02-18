import type { Translations } from './en';

export const de: Translations = {
  // Common strings used across multiple components
  common: {
    back: 'Zurück',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    remove: 'Entfernen',
    restart: 'Neu starten',
    start: 'Starten',
    save: 'Speichern',
    loading: 'Laden...',
    error: 'Fehler',
    points: 'Punkte',
    of: 'von',
    question: 'Frage',
    questions: 'Fragen',
    correct: 'Richtig',
    incorrect: 'Falsch',
    partial: 'Teilweise',
    answered: 'Beantwortet',
    backToOverview: 'Zurück zur Übersicht',
  },

  // Quiz Selection screen
  quizSelection: {
    title: 'iSAQB CPSA-F Übungsprüfungen',
    subtitle: 'Wähle ein Quiz aus, um zu beginnen oder fortzufahren.',
    answered: 'beantwortet',
    completed: 'Abgeschlossen',
    notStarted: 'Noch nicht gestartet',
    resetTitle: 'Quiz neu starten',
    bookmarks: 'Lesezeichen',
    history: 'Verlauf',
    reviews: 'Wiederholungen',
    confirmReset: 'Fortschritt für dieses Quiz wirklich zurücksetzen?',
  },

  // Quiz Setup modal
  quizSetup: {
    title: 'Quiz-Einstellungen',
    questionCount: '{count} Fragen',
    modeLabel: 'Modus',
    practiceMode: 'Übungsmodus',
    practiceDesc: 'Sofortiges Feedback nach jeder Frage',
    examMode: 'Prüfungsmodus',
    examDesc: 'Feedback erst am Ende',
    timerLabel: 'Zeitlimit',
    timerEnabled: 'Mit Zeitlimit',
    timerDisabled: 'Ohne Zeitlimit',
    minutes: 'Minuten',
    orderLabel: 'Fragenreihenfolge',
    sequential: 'Originalreihenfolge',
    random: 'Zufällige Reihenfolge',
    start: 'Quiz starten',
  },

  // Quiz View
  quizView: {
    loadingExam: 'Lade Prüfung...',
    noExamData: 'Keine Prüfungsdaten gefunden.',
    examModeInfo: 'Prüfungsmodus: Feedback wird erst nach Abgabe angezeigt',
    submitExam: 'Prüfung abgeben',
    submitEarly: 'Vorzeitig abgeben',
    confirmSubmit: 'Möchten Sie die Prüfung abgeben? Ihre Antworten werden ausgewertet.',
    confirmRestart: 'Möchten Sie wirklich neu starten? Ihr Fortschritt wird gelöscht.',
  },

  // Question Card
  questionCard: {
    question: 'Frage',
    explanation: 'Erklärung',
    checkAnswer: 'Antwort prüfen',
    save: 'Speichern',
    pointsDisplay: '{earned} / {max} Punkte',
  },

  // Question type labels
  questionTypes: {
    single_choice: 'A-Frage',
    multiple_choice: 'P-Frage',
    classification_matrix: 'K-Frage',
    single_choice_long: 'A-Fragen (Einzelauswahl)',
    multiple_choice_long: 'P-Fragen (Mehrfachauswahl)',
    classification_matrix_long: 'K-Fragen (Zuordnung)',
  },

  // Multiple Choice
  multipleChoice: {
    selectCount: 'Wählen Sie {count} Antworten aus.',
  },

  // Classification Matrix
  classificationMatrix: {
    statement: 'Aussage',
  },

  // Score Summary
  scoreSummary: {
    result: 'Ergebnis',
    passed: 'Bestanden',
    failed: 'Nicht bestanden',
    passingNote: 'Zum Bestehen werden mindestens 60% benötigt.',
    toOverview: 'Zur Übersicht',
    retryIncorrect: 'Falsche wiederholen',
  },

  // Header
  header: {
    backToOverview: 'Zurück zur Übersicht',
    hideNav: 'Navigation ausblenden',
    showNav: 'Navigation einblenden',
  },

  // Timer
  timer: {
    pause: 'Timer pausieren',
    resume: 'Timer fortsetzen',
  },

  // Flag button
  flag: {
    remove: 'Markierung entfernen',
    add: 'Zur Überprüfung markieren',
  },

  // Bookmark button
  bookmark: {
    remove: 'Lesezeichen entfernen',
    add: 'Lesezeichen hinzufügen',
  },

  // Question navigation
  questionNav: {
    jumpTo: 'Zu Frage {num} springen',
    flagged: 'markiert',
    flaggedForReview: 'markiert zur Überprüfung',
  },

  // Back to top
  backToTop: 'Zurück nach oben',

  // Bookmarked Questions view
  bookmarks: {
    title: 'Lesezeichen',
    subtitle: 'Gespeicherte Fragen zum Wiederholen',
    empty: 'Keine Lesezeichen vorhanden',
    emptyHint: 'Markiere Fragen mit dem Lesezeichen-Symbol, um sie hier zu speichern.',
    clearAll: 'Alle entfernen',
    goToQuestion: 'Zur Frage',
    fromQuiz: 'aus',
    confirmClearAll: 'Alle Lesezeichen wirklich entfernen?',
  },

  // History view
  history: {
    title: 'Verlauf',
    subtitle: 'Deine bisherigen Versuche',
    empty: 'Noch keine Versuche',
    emptyHint: 'Schließe ein Quiz ab, um deinen Fortschritt hier zu sehen.',
    clearAll: 'Verlauf löschen',
    view: 'Details',
    practice: 'Übung',
    exam: 'Prüfung',
    duration: 'Dauer',
    stats: 'Statistiken nach Fragentyp',
    best: 'Bester',
    average: 'Durchschnitt',
    attempts: 'Versuche',
    confirmClearAll: 'Gesamten Verlauf wirklich löschen?',
    confirmDelete: 'Diesen Versuch wirklich löschen?',
    passed: 'Bestanden',
    failed: 'Nicht bestanden',
    score: 'Punkte',
  },

  // Attempt Detail view
  attemptDetail: {
    back: 'Zurück',
    passed: 'Bestanden',
    failed: 'Nicht bestanden',
    practice: 'Übungsmodus',
    exam: 'Prüfungsmodus',
    duration: 'Dauer',
    score: 'Punkte',
    questions: 'Fragen',
    correct: 'Richtig',
    partial: 'Teilweise',
    incorrect: 'Falsch',
    timeSpent: 'Zeit',
    questionResults: 'Ergebnisse nach Frage',
  },

  // Type Breakdown
  typeBreakdown: {
    correct: 'Richtig',
    partial: 'Teilweise',
    incorrect: 'Falsch',
    avgTime: 'Ø Zeit',
    accuracy: 'Genauigkeit',
  },

  // Spaced Repetition view
  spacedRepetition: {
    title: 'Wiederholungen',
    subtitle: 'Fällige Fragen basierend auf Spaced Repetition',
    noDue: 'Keine Wiederholungen fällig',
    noDueDesc: 'Beantworte Fragen in den Quiz, um Wiederholungen zu planen.',
    overdue: 'überfällig',
    dueToday: 'heute fällig',
    totalDue: 'insgesamt fällig',
    startReview: 'Wiederholung starten',
    stats: 'Statistiken',
    mastered: 'Gemeistert',
    learning: 'In Arbeit',
    newOrReset: 'Neu/Zurückgesetzt',
    total: 'Gesamt',
    avgEase: 'Durchschnittliche Leichtigkeit',
    clearAll: 'Alle Daten löschen',
    confirmClear: 'Alle Lernfortschritte wirklich löschen?',
  },

  // Focus Mode Setup
  focusMode: {
    title: 'Fokus-Modus',
    subtitle: 'Wähle aus, welche Fragen du wiederholen möchtest',
    incorrectLabel: 'Falsch beantwortete Fragen',
    incorrectDesc: 'Fragen, die beim letzten Versuch falsch waren',
    flaggedLabel: 'Markierte Fragen',
    flaggedDesc: 'Fragen, die du zur Überprüfung markiert hast',
    bookmarkedLabel: 'Lesezeichen',
    bookmarkedDesc: 'Fragen, die du mit Lesezeichen versehen hast',
    customLabel: 'Benutzerdefiniert',
    customDesc: 'Wähle spezifische Kategorien aus',
    noQuestions: 'Keine Fragen verfügbar',
  },

  // Preferences panel
  preferences: {
    settings: 'Einstellungen',
    theme: 'Erscheinungsbild',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
    fontSize: 'Schriftgröße',
    small: 'Klein',
    medium: 'Mittel',
    large: 'Groß',
  },
};
