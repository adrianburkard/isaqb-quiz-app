import { useTranslation } from '../i18n';
import type { Language } from '../types';

interface Props {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  language?: Language;
}

export function BookmarkButton({ isBookmarked, onToggle, size = 'md', language = 'de' }: Props) {
  const { section } = useTranslation(language);
  const t = section('bookmark');
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonClasses = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`${buttonClasses} rounded-lg transition-colors ${
        isBookmarked
          ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50'
          : 'text-muted hover:text-blue-500 hover:bg-hover'
      }`}
      title={isBookmarked ? t.remove : t.add}
      aria-label={isBookmarked ? t.remove : t.add}
    >
      <svg
        className={sizeClasses}
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
