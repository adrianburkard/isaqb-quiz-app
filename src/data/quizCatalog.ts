import type { QuizInfo, Language } from '../types';

export const quizCatalog: QuizInfo[] = [
  // German quizzes
  {
    id: 'de-set-1',
    filename: 'german/german-questions-1.json',
    title: 'Set 1',
    description: 'Einstieg in die iSAQB-Themen',
    language: 'de',
  },
  {
    id: 'de-set-2',
    filename: 'german/german-questions-2.json',
    title: 'Set 2',
    description: 'Erweiterte Schwierigkeit',
    language: 'de',
  },
  {
    id: 'de-set-3',
    filename: 'german/german-questions-3.json',
    title: 'Set 3',
    description: 'Experten-Level Fragen',
    language: 'de',
  },
  {
    id: 'de-set-4',
    filename: 'german/german-questions-4.json',
    title: 'Set 4',
    description: 'Weitere fortgeschrittene Fragen',
    language: 'de',
  },
  {
    id: 'de-set-5',
    filename: 'german/german-questions-5.json',
    title: 'Set 5',
    description: 'Weitere Fragen zur Prüfungsvorbereitung',
    language: 'de',
  },
  {
    id: 'de-mock-exam',
    filename: 'german/german-mock-exam.json',
    title: 'Probeklausur Mock Exam',
    description: 'Offizielle Probeprüfung',
    language: 'de',
  },
  // English quizzes
  {
    id: 'en-set-1',
    filename: 'english/english-questions-1.json',
    title: 'Set 1',
    description: 'Introduction to iSAQB topics',
    language: 'en',
  },
  {
    id: 'en-set-2',
    filename: 'english/english-questions-2.json',
    title: 'Set 2',
    description: 'Intermediate difficulty',
    language: 'en',
  },
  {
    id: 'en-set-3',
    filename: 'english/english-questions-3.json',
    title: 'Set 3',
    description: 'Advanced level questions',
    language: 'en',
  },
  {
    id: 'en-set-4',
    filename: 'english/english-questions-4.json',
    title: 'Set 4',
    description: 'Expert level questions',
    language: 'en',
  },
  {
    id: 'en-set-5',
    filename: 'english/english-questions-5.json',
    title: 'Set 5',
    description: 'Final exam preparation',
    language: 'en',
  },
  {
    id: 'en-mock-exam',
    filename: 'english/english-mock-exam.json',
    title: 'Mock Exam',
    description: 'Official practice exam',
    language: 'en',
  },
];

export const languageLabels: Record<Language, string> = {
  de: 'Deutsch',
  en: 'English',
};
