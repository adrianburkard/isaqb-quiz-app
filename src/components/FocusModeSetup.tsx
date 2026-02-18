import { useState } from 'react';
import type { Language } from '../types';
import type { FocusModeConfig } from '../types/learning';

interface Props {
  quizTitle: string;
  incorrectCount: number;
  flaggedCount: number;
  bookmarkedCount: number;
  language: Language;
  onStart: (config: FocusModeConfig) => void;
  onCancel: () => void;
  quizId: string;
  incorrectIds: string[];
  flaggedIds: string[];
  bookmarkedIds: string[];
}

export function FocusModeSetup({
  quizTitle,
  incorrectCount,
  flaggedCount,
  bookmarkedCount,
  language,
  onStart,
  onCancel,
  quizId,
  incorrectIds,
  flaggedIds,
  bookmarkedIds,
}: Props) {
  const [selectedMode, setSelectedMode] = useState<'incorrect' | 'flagged' | 'bookmarked' | 'custom'>('incorrect');
  const [customIds, setCustomIds] = useState<Set<string>>(new Set());

  const labels = {
    de: {
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
      questions: 'Fragen',
      start: 'Starten',
      cancel: 'Abbrechen',
    },
    en: {
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
      questions: 'questions',
      start: 'Start',
      cancel: 'Cancel',
    },
  };

  const t = labels[language];

  const getQuestionIds = (): string[] => {
    switch (selectedMode) {
      case 'incorrect':
        return incorrectIds;
      case 'flagged':
        return flaggedIds;
      case 'bookmarked':
        return bookmarkedIds;
      case 'custom':
        return Array.from(customIds);
    }
  };

  const getQuestionCount = (): number => {
    return getQuestionIds().length;
  };

  const handleCustomToggle = (category: 'incorrect' | 'flagged' | 'bookmarked') => {
    const ids = category === 'incorrect' ? incorrectIds
      : category === 'flagged' ? flaggedIds
      : bookmarkedIds;

    setCustomIds((prev) => {
      const next = new Set(prev);
      const allIncluded = ids.every((id) => next.has(id));
      if (allIncluded) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleStart = () => {
    const questionIds = getQuestionIds();
    if (questionIds.length === 0) return;

    onStart({
      quizId,
      questionIds,
      mode: selectedMode,
    });
  };

  const canStart = getQuestionCount() > 0;

  const options = [
    {
      mode: 'incorrect' as const,
      label: t.incorrectLabel,
      desc: t.incorrectDesc,
      count: incorrectCount,
      color: 'red',
    },
    {
      mode: 'flagged' as const,
      label: t.flaggedLabel,
      desc: t.flaggedDesc,
      count: flaggedCount,
      color: 'orange',
    },
    {
      mode: 'bookmarked' as const,
      label: t.bookmarkedLabel,
      desc: t.bookmarkedDesc,
      count: bookmarkedCount,
      color: 'blue',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary mb-1">{t.title}</h2>
          <p className="text-secondary text-sm mb-1">{quizTitle}</p>
          <p className="text-muted text-sm mb-6">{t.subtitle}</p>

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.mode}
                onClick={() => setSelectedMode(option.mode)}
                disabled={option.count === 0}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedMode === option.mode
                    ? option.color === 'red'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : option.color === 'orange'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : option.count === 0
                      ? 'border-default bg-muted opacity-50 cursor-not-allowed'
                      : 'border-default hover:border-muted hover:bg-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary">{option.label}</div>
                    <div className="text-sm text-secondary">{option.desc}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    option.count === 0
                      ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      : option.color === 'red'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        : option.color === 'orange'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}>
                    {option.count}
                  </div>
                </div>
              </button>
            ))}

            {/* Custom mode */}
            <button
              onClick={() => setSelectedMode('custom')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                selectedMode === 'custom'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-default hover:border-muted hover:bg-hover'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-primary">{t.customLabel}</div>
                  <div className="text-sm text-secondary">{t.customDesc}</div>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {customIds.size}
                </div>
              </div>
            </button>

            {/* Custom selection checkboxes */}
            {selectedMode === 'custom' && (
              <div className="ml-4 space-y-2 pt-2 border-t border-default">
                {options.map((option) => (
                  <label
                    key={option.mode}
                    className={`flex items-center gap-3 p-2 rounded ${
                      option.count === 0 ? 'opacity-50' : 'cursor-pointer hover:bg-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={option.count === 0}
                      checked={option.mode === 'incorrect'
                        ? incorrectIds.every((id) => customIds.has(id)) && incorrectIds.length > 0
                        : option.mode === 'flagged'
                          ? flaggedIds.every((id) => customIds.has(id)) && flaggedIds.length > 0
                          : bookmarkedIds.every((id) => customIds.has(id)) && bookmarkedIds.length > 0
                      }
                      onChange={() => handleCustomToggle(option.mode)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-primary">{option.label}</span>
                    <span className="text-muted text-sm">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-default">
            <div className="text-center text-sm text-secondary mb-4">
              {canStart
                ? `${getQuestionCount()} ${t.questions}`
                : t.noQuestions
              }
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-default text-secondary rounded-lg hover:bg-hover transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleStart}
                disabled={!canStart}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  canStart
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                }`}
              >
                {t.start}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
