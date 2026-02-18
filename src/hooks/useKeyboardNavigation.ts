import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  totalQuestions: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  totalQuestions,
  currentIndex,
  onNavigate,
  enabled = true,
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't handle if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;

        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < totalQuestions - 1) {
            onNavigate(currentIndex + 1);
          }
          break;

        case 'Home':
          event.preventDefault();
          onNavigate(0);
          break;

        case 'End':
          event.preventDefault();
          onNavigate(totalQuestions - 1);
          break;

        default: {
          // Number keys 1-9 for quick navigation
          const num = parseInt(event.key, 10);
          if (!isNaN(num) && num >= 1 && num <= 9) {
            const targetIndex = num - 1;
            if (targetIndex < totalQuestions) {
              event.preventDefault();
              onNavigate(targetIndex);
            }
          }
          break;
        }
      }
    },
    [enabled, currentIndex, totalQuestions, onNavigate]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}
