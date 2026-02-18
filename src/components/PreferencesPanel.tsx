import { useState, useRef, useEffect } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import type { Theme, FontSize, Language } from '../types';

interface Props {
  language: Language;
}

export function PreferencesPanel({ language }: Props) {
  const { preferences, setTheme, setFontSize } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const labels = {
    de: {
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
    en: {
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
  };

  const t = labels[language];

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: t.light },
    { value: 'dark', label: t.dark },
    { value: 'system', label: t.system },
  ];

  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'small', label: t.small },
    { value: 'medium', label: t.medium },
    { value: 'large', label: t.large },
  ];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors"
        title={t.settings}
        aria-label={t.settings}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg shadow-lg border border-default z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-primary mb-3">
              {t.settings}
            </h3>

            {/* Theme selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-muted mb-2">
                {t.theme}
              </label>
              <div className="flex gap-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                      preferences.theme === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-secondary hover:bg-hover'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size selection */}
            <div>
              <label className="block text-xs font-medium text-muted mb-2">
                {t.fontSize}
              </label>
              <div className="flex gap-1">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFontSize(option.value)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                      preferences.fontSize === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-secondary hover:bg-hover'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
