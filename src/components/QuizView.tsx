import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuizState } from '../hooks/useQuizState';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { Header } from './Header';
import { QuestionCard } from './QuestionCard';
import { QuestionNav } from './QuestionNav';
import { BackToTop } from './BackToTop';
import { ScoreSummary } from './ScoreSummary';
import type { QuizInfo } from '../types';

interface Props {
  quizInfo: QuizInfo;
  onBack: () => void;
}

export function QuizView({ quizInfo, onBack }: Props) {
  const {
    exam,
    answers,
    scores,
    isLoading,
    error,
    submitAnswer,
    resetQuiz,
    resetKey,
    stats,
  } = useQuizState(quizInfo);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNav, setShowNav] = useState(true);

  // Scroll to question by index
  const scrollToQuestion = useCallback((index: number) => {
    const ref = questionRefs.current[index];
    if (ref) {
      const headerOffset = showNav ? 180 : 100; // Adjust based on nav visibility
      const elementPosition = ref.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  }, [showNav]);

  // Track current visible question based on scroll position
  useEffect(() => {
    if (!exam) return;

    const handleScroll = () => {
      const headerOffset = showNav ? 180 : 100;

      // Find the first question that's below the header
      for (let i = 0; i < questionRefs.current.length; i++) {
        const ref = questionRefs.current[i];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // If the bottom of the question is below the header, it's the current one
          if (rect.bottom > headerOffset) {
            setCurrentIndex(i);
            return;
          }
        }
      }

      // If we scrolled past all questions, select the last one
      setCurrentIndex(questionRefs.current.length - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [exam, resetKey, showNav]);

  // Keyboard navigation
  useKeyboardNavigation({
    totalQuestions: exam?.questions.length ?? 0,
    currentIndex,
    onNavigate: scrollToQuestion,
    enabled: !!exam,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-secondary">Lade Prüfung...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-error mb-4">Fehler: {error}</div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-secondary">Keine Prüfungsdaten gefunden.</div>
      </div>
    );
  }

  const isComplete = stats.answeredCount === stats.totalQuestions;

  return (
    <div className="min-h-screen bg-page">
      <Header
        title={exam.exam_title}
        answeredCount={stats.answeredCount}
        totalCount={stats.totalQuestions}
        earnedPoints={stats.earnedPoints}
        maxPoints={stats.maxPoints}
        showScore={stats.answeredCount > 0}
        onBack={onBack}
        showNav={showNav}
        onToggleNav={() => setShowNav(!showNav)}
        questionNav={
          <QuestionNav
            questions={exam.questions}
            scores={scores}
            onNavigate={scrollToQuestion}
            currentIndex={currentIndex}
          />
        }
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {isComplete && (
          <div className="mb-6">
            <ScoreSummary
              earnedPoints={stats.earnedPoints}
              maxPoints={stats.maxPoints}
              onReset={resetQuiz}
              onBack={onBack}
            />
          </div>
        )}

        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <div
              key={`${question.id}-${resetKey}`}
              ref={(el) => { questionRefs.current[index] = el; }}
            >
              <QuestionCard
                question={question}
                questionNumber={index + 1}
                submittedAnswer={answers[question.id] ?? null}
                score={scores[question.id] ?? null}
                onSubmit={(answer) => submitAnswer(question.id, answer)}
              />
            </div>
          ))}
        </div>

        {!isComplete && stats.answeredCount > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              Zurück zur Übersicht
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Möchten Sie wirklich neu starten? Ihr Fortschritt wird gelöscht.'
                  )
                ) {
                  resetQuiz();
                }
              }}
              className="px-4 py-2 text-error border border-error rounded-lg hover:bg-error transition-colors"
            >
              Neu starten
            </button>
          </div>
        )}

        {!isComplete && stats.answeredCount === 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onBack}
              className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              Zurück zur Übersicht
            </button>
          </div>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
