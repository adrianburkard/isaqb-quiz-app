import { useState } from 'react';
import type { QuizSettings, QuizMode, Language } from '../types';

interface Props {
  quizTitle: string;
  questionCount: number;
  language: Language;
  onStart: (settings: QuizSettings) => void;
  onCancel: () => void;
}

const DEFAULT_TIMER_MINUTES = 75; // iSAQB exam is 75 minutes

export function QuizSetup({
  quizTitle,
  questionCount,
  language,
  onStart,
  onCancel,
}: Props) {
  const [mode, setMode] = useState<QuizMode>('practice');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_TIMER_MINUTES);
  const [randomOrder, setRandomOrder] = useState(false);

  const labels = {
    de: {
      title: 'Quiz-Einstellungen',
      subtitle: quizTitle,
      questionCount: `${questionCount} Fragen`,
      modeLabel: 'Modus',
      practiceMode: 'Übungsmodus',
      practiceDesc: 'Sofortiges Feedback nach jeder Frage',
      examMode: 'Prüfungsmodus',
      examDesc: 'Feedback erst am Ende der Prüfung',
      timerLabel: 'Zeitlimit',
      timerEnabled: 'Mit Zeitlimit',
      timerDisabled: 'Ohne Zeitlimit',
      minutes: 'Minuten',
      orderLabel: 'Reihenfolge',
      sequential: 'Original-Reihenfolge',
      random: 'Zufällige Reihenfolge',
      start: 'Quiz starten',
      cancel: 'Abbrechen',
    },
    en: {
      title: 'Quiz Settings',
      subtitle: quizTitle,
      questionCount: `${questionCount} questions`,
      modeLabel: 'Mode',
      practiceMode: 'Practice Mode',
      practiceDesc: 'Immediate feedback after each question',
      examMode: 'Exam Mode',
      examDesc: 'Feedback only at the end of the exam',
      timerLabel: 'Time Limit',
      timerEnabled: 'With time limit',
      timerDisabled: 'No time limit',
      minutes: 'minutes',
      orderLabel: 'Order',
      sequential: 'Original order',
      random: 'Random order',
      start: 'Start Quiz',
      cancel: 'Cancel',
    },
  };

  const t = labels[language];

  const handleStart = () => {
    onStart({
      mode,
      timerEnabled,
      timerMinutes,
      randomOrder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary mb-1">{t.title}</h2>
          <p className="text-secondary text-sm mb-1">{t.subtitle}</p>
          <p className="text-muted text-xs mb-6">{t.questionCount}</p>

          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-3">
              {t.modeLabel}
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  mode === 'practice'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-default hover:bg-hover'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value="practice"
                  checked={mode === 'practice'}
                  onChange={() => setMode('practice')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-primary">{t.practiceMode}</div>
                  <div className="text-sm text-secondary">{t.practiceDesc}</div>
                </div>
              </label>
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  mode === 'exam'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-default hover:bg-hover'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value="exam"
                  checked={mode === 'exam'}
                  onChange={() => setMode('exam')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-primary">{t.examMode}</div>
                  <div className="text-sm text-secondary">{t.examDesc}</div>
                </div>
              </label>
            </div>
          </div>

          {/* Timer Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-3">
              {t.timerLabel}
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-primary">
                  {timerEnabled ? t.timerEnabled : t.timerDisabled}
                </span>
              </label>
              {timerEnabled && (
                <div className="flex items-center gap-2 ml-7">
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(parseInt(e.target.value, 10) || DEFAULT_TIMER_MINUTES)}
                    className="w-20 px-3 py-2 border border-default rounded-lg bg-card text-primary"
                  />
                  <span className="text-secondary">{t.minutes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Setting */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-primary mb-3">
              {t.orderLabel}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="order"
                  checked={!randomOrder}
                  onChange={() => setRandomOrder(false)}
                />
                <span className="text-primary">{t.sequential}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="order"
                  checked={randomOrder}
                  onChange={() => setRandomOrder(true)}
                />
                <span className="text-primary">{t.random}</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleStart}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {t.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
