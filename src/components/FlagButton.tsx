interface Props {
  isFlagged: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export function FlagButton({ isFlagged, onToggle, size = 'md' }: Props) {
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonClasses = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`${buttonClasses} rounded-lg transition-colors ${
        isFlagged
          ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50'
          : 'text-muted hover:text-orange-500 hover:bg-hover'
      }`}
      title={isFlagged ? 'Markierung entfernen' : 'Zur Überprüfung markieren'}
      aria-label={isFlagged ? 'Markierung entfernen' : 'Zur Überprüfung markieren'}
    >
      <svg
        className={sizeClasses}
        fill={isFlagged ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
        />
      </svg>
    </button>
  );
}
