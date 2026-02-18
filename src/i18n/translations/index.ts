import { en, type Translations } from './en';
import { de } from './de';
import type { Language } from '../../types';

export const translations: Record<Language, Translations> = {
  en,
  de,
};

export type { Translations };
export { en, de };
