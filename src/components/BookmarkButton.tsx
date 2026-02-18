interface Props {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export function BookmarkButton({ isBookmarked, onToggle, size = 'md' }: Props) {
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
      title={isBookmarked ? 'Lesezeichen entfernen' : 'Lesezeichen hinzufügen'}
      aria-label={isBookmarked ? 'Lesezeichen entfernen' : 'Lesezeichen hinzufügen'}
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
