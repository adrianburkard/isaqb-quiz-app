import { useState } from 'react';
import { useTranslation } from '../i18n';
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
  const { t, section } = useTranslation(language);
  const labels = section('quizSetup');
  const common = section('common');

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
          <h2 className="text-xl font-bold text-primary mb-1">{labels.title}</h2>
          <p className="text-secondary text-sm mb-1">{quizTitle}</p>
          <p className="text-muted text-xs mb-6">{t('quizSetup.questionCount', { count: questionCount })}</p>

          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-3">
              {labels.modeLabel}
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
                  <div className="font-medium text-primary">{labels.practiceMode}</div>
                  <div className="text-sm text-secondary">{labels.practiceDesc}</div>
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
                  <div className="font-medium text-primary">{labels.examMode}</div>
                  <div className="text-sm text-secondary">{labels.examDesc}</div>
                </div>
              </label>
            </div>
          </div>

          {/* Timer Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-3">
              {labels.timerLabel}
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
                  {timerEnabled ? labels.timerEnabled : labels.timerDisabled}
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
                  <span className="text-secondary">{labels.minutes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Setting */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-primary mb-3">
              {labels.orderLabel}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="order"
                  checked={!randomOrder}
                  onChange={() => setRandomOrder(false)}
                />
                <span className="text-primary">{labels.sequential}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="order"
                  checked={randomOrder}
                  onChange={() => setRandomOrder(true)}
                />
                <span className="text-primary">{labels.random}</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              {common.cancel}
            </button>
            <button
              onClick={handleStart}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {labels.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
