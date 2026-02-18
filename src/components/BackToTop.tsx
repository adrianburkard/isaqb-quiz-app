import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import type { Language } from '../types';

interface Props {
  threshold?: number;
  language?: Language;
}

export function BackToTop({ threshold = 400, language = 'de' }: Props) {
  const { t } = useTranslation(language);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all z-50"
      aria-label={t('backToTop')}
      title={t('backToTop')}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
