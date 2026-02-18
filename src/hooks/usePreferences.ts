import { usePreferencesContext } from '../contexts/PreferencesContext';

export function usePreferences() {
  return usePreferencesContext();
}
