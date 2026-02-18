import { useCallback, useMemo } from 'react';
import { translations, type Translations } from './translations';
import { interpolate } from './interpolate';
import type { Language } from '../types';

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation key "${path}" does not resolve to a string`);
    return path;
  }

  return value;
}

/**
 * Hook for accessing translations
 *
 * @example
 * const { t } = useTranslation(language);
 * t('quizSelection.title') // Returns translated string
 * t('multipleChoice.selectCount', { count: 3 }) // With interpolation
 *
 * @example
 * const { section } = useTranslation(language);
 * const labels = section('quizSetup');
 * labels.title // Type-safe access to section
 */
export function useTranslation(language: Language) {
  const currentTranslations = useMemo(
    () => translations[language],
    [language]
  );

  /**
   * Get a translation by dot-notation key
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = getNestedValue(currentTranslations, key);
      return params ? interpolate(value, params) : value;
    },
    [currentTranslations]
  );

  /**
   * Get a section of translations for component-level access
   */
  const section = useCallback(
    <K extends keyof Translations>(sectionKey: K): Translations[K] => {
      return currentTranslations[sectionKey];
    },
    [currentTranslations]
  );

  return {
    t,
    section,
    language,
  };
}

// Re-export types and utilities
export type { Translations };
export { interpolate };
