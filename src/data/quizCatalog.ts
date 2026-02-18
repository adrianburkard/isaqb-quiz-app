import type { QuizInfo, Language } from '../types';

export const quizCatalog: QuizInfo[] = [
  // German quizzes
  {
    id: 'de-practice-01',
    filename: 'german/german-questions-1.json',
    title: 'Set 1',
    description: 'Einstieg in die iSAQB-Themen',
    language: 'de',
  },
  {
    id: 'de-practice-02',
    filename: 'german/german-questions-2.json',
    title: 'Set 2',
    description: 'Erweiterte Schwierigkeit',
    language: 'de',
  },
  {
    id: 'de-practice-03',
    filename: 'german/german-questions-3.json',
    title: 'Set 3',
    description: 'Experten-Level Fragen',
    language: 'de',
  },
  {
    id: 'de-practice-04',
    filename: 'german/german-questions-4.json',
    title: 'Set 4',
    description: 'Weitere fortgeschrittene Fragen',
    language: 'de',
  },
  {
    id: 'de-practice-05',
    filename: 'german/german-questions-5.json',
    title: 'Set 5',
    description: 'Weitere Fragen zur Prüfungsvorbereitung',
    language: 'de',
  },
  {
    id: 'de-mock-01',
    filename: 'german/german-mock-exam.json',
    title: 'Probeklausur Mock Exam',
    description: 'Offizielle Probeprüfung',
    language: 'de',
  },
  // English quizzes
  {
    id: 'en-practice-01',
    filename: 'english/english-questions-1.json',
    title: 'Set 1',
    description: 'Introduction to iSAQB topics',
    language: 'en',
  },
  {
    id: 'en-practice-02',
    filename: 'english/english-questions-2.json',
    title: 'Set 2',
    description: 'Intermediate difficulty',
    language: 'en',
  },
  {
    id: 'en-practice-03',
    filename: 'english/english-questions-3.json',
    title: 'Set 3',
    description: 'Advanced level questions',
    language: 'en',
  },
  {
    id: 'en-practice-04',
    filename: 'english/english-questions-4.json',
    title: 'Set 4',
    description: 'Expert level questions',
    language: 'en',
  },
  {
    id: 'en-practice-05',
    filename: 'english/english-questions-5.json',
    title: 'Set 5',
    description: 'Final exam preparation',
    language: 'en',
  },
  {
    id: 'en-mock-01',
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
