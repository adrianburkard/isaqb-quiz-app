import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuizState } from '../hooks/useQuizState';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useTimer } from '../hooks/useTimer';
import { useQuestionMarks } from '../hooks/useQuestionMarks';
import { useQuestionTiming } from '../hooks/useQuestionTiming';
import { useQuizHistory } from '../hooks/useQuizHistory';
import { useTranslation } from '../i18n';
import { Header } from './Header';
import { QuestionCard } from './QuestionCard';
import { QuestionNav } from './QuestionNav';
import { BackToTop } from './BackToTop';
import { ScoreSummary } from './ScoreSummary';
import { QuizSetup } from './QuizSetup';
import { Timer } from './Timer';
import type { QuizInfo } from '../types';
import type { QuestionResult } from '../types/history';

interface Props {
  quizInfo: QuizInfo;
  onBack: () => void;
}

export function QuizView({ quizInfo, onBack }: Props) {
  const { section } = useTranslation(quizInfo.language);
  const t = section('quizView');
  const common = section('common');

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
    settings,
    orderedQuestions,
    needsSetup,
    startWithSettings,
    timeRemainingMs,
    updateTimeRemaining,
  } = useQuizState(quizInfo);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [feedbackRevealed, setFeedbackRevealed] = useState(false);

  const isExamMode = settings.mode === 'exam';
  const allAnswered = stats.answeredCount === stats.totalQuestions && stats.totalQuestions > 0;

  // Question marks (flags and bookmarks)
  const questionMarks = useQuestionMarks({
    quizId: quizInfo.id,
  });

  // Question timing
  const questionTiming = useQuestionTiming({
    questionIds: orderedQuestions.map((q) => q.id),
    enabled: !needsSetup,
  });

  // Quiz history
  const { saveAttempt } = useQuizHistory();
  const attemptSavedRef = useRef(false);

  // Timer hook
  const timer = useTimer({
    initialTimeMs: timeRemainingMs ?? settings.timerMinutes * 60 * 1000,
    enabled: settings.timerEnabled && !needsSetup && !feedbackRevealed,
    persistKey: `isaqb-quiz-timer-${quizInfo.id}`,
    onTimeUp: () => {
      if (isExamMode) {
        setFeedbackRevealed(true);
      }
    },
  });

  // Start timer when quiz starts
  useEffect(() => {
    if (settings.timerEnabled && !needsSetup && !feedbackRevealed && !timer.isRunning && !timer.isTimeUp) {
      timer.start();
    }
  }, [settings.timerEnabled, needsSetup, feedbackRevealed, timer]);

  // Persist timer state
  useEffect(() => {
    if (settings.timerEnabled && timer.timeRemainingMs > 0) {
      updateTimeRemaining(timer.timeRemainingMs);
    }
  }, [settings.timerEnabled, timer.timeRemainingMs, updateTimeRemaining]);

  // Scroll to question by index
  const scrollToQuestion = useCallback((index: number) => {
    const ref = questionRefs.current[index];
    if (ref) {
      const headerOffset = showNav ? 180 : 100;
      const elementPosition = ref.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  }, [showNav]);

  // Track current visible question based on scroll position
  useEffect(() => {
    if (!exam || needsSetup) return;

    const handleScroll = () => {
      const headerOffset = showNav ? 180 : 100;

      for (let i = 0; i < questionRefs.current.length; i++) {
        const ref = questionRefs.current[i];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.bottom > headerOffset) {
            setCurrentIndex(i);
            return;
          }
        }
      }

      setCurrentIndex(questionRefs.current.length - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [exam, resetKey, showNav, needsSetup]);

  // Keyboard navigation
  useKeyboardNavigation({
    totalQuestions: orderedQuestions.length,
    currentIndex,
    onNavigate: scrollToQuestion,
    enabled: !!exam && !needsSetup,
  });

  // Track timing when current question changes
  useEffect(() => {
    if (orderedQuestions.length > 0 && currentIndex >= 0) {
      const questionId = orderedQuestions[currentIndex]?.id;
      if (questionId) {
        questionTiming.onQuestionVisible(questionId);
      }
    }
  }, [currentIndex, orderedQuestions, questionTiming]);

  // Save attempt when quiz is completed (practice mode) or feedback is revealed (exam mode)
  useEffect(() => {
    if (!exam || attemptSavedRef.current || needsSetup) return;

    const shouldSave = isExamMode ? feedbackRevealed : allAnswered;
    if (!shouldSave) return;

    // Build question results
    const timings = questionTiming.getAllTimings();
    const questionResults: QuestionResult[] = orderedQuestions.map((question) => {
      const score = scores[question.id];
      return {
        questionId: question.id,
        questionType: question.type,
        earnedPoints: score?.earnedPoints ?? 0,
        maxPoints: question.points,
        isCorrect: score?.isFullyCorrect ?? false,
        timeSpentMs: timings[question.id] ?? 0,
      };
    });

    // Get start time from progress
    const progress = localStorage.getItem(`isaqb-quiz-${quizInfo.id}`);
    const startedAt = progress ? JSON.parse(progress).startedAt : new Date().toISOString();

    saveAttempt(
      quizInfo.id,
      exam.exam_title,
      startedAt,
      stats.earnedPoints,
      stats.maxPoints,
      questionResults,
      settings.mode
    );

    attemptSavedRef.current = true;
  }, [
    exam,
    needsSetup,
    isExamMode,
    feedbackRevealed,
    allAnswered,
    orderedQuestions,
    scores,
    questionTiming,
    quizInfo.id,
    stats.earnedPoints,
    stats.maxPoints,
    settings.mode,
    saveAttempt,
  ]);

  // Handle exam submission
  const handleSubmitExam = () => {
    if (window.confirm(t.confirmSubmit)) {
      timer.pause();
      setFeedbackRevealed(true);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm(t.confirmRestart)) {
      timer.reset();
      setFeedbackRevealed(false);
      attemptSavedRef.current = false;
      questionMarks.clearFlags();
      questionTiming.resetTimings();
      resetQuiz();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-secondary">{t.loadingExam}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-error mb-4">{common.error}: {error}</div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {common.backToOverview}
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-secondary">{t.noExamData}</div>
      </div>
    );
  }

  // Show setup modal for new quizzes
  if (needsSetup) {
    return (
      <div className="min-h-screen bg-page">
        <QuizSetup
          quizTitle={exam.exam_title}
          questionCount={exam.questions.length}
          language={quizInfo.language}
          onStart={startWithSettings}
          onCancel={onBack}
        />
      </div>
    );
  }

  // In practice mode, show completion when all answered
  // In exam mode, show completion only when feedback is revealed
  const showCompletion = isExamMode
    ? feedbackRevealed
    : allAnswered;

  // In practice mode, show score always after first answer
  // In exam mode, only show score when feedback is revealed
  const showScore = isExamMode
    ? feedbackRevealed
    : stats.answeredCount > 0;

  return (
    <div className="min-h-screen bg-page">
      <Header
        title={exam.exam_title}
        answeredCount={stats.answeredCount}
        totalCount={stats.totalQuestions}
        earnedPoints={stats.earnedPoints}
        maxPoints={stats.maxPoints}
        showScore={showScore}
        onBack={onBack}
        showNav={showNav}
        onToggleNav={() => setShowNav(!showNav)}
        language={quizInfo.language}
        questionNav={
          <QuestionNav
            questions={orderedQuestions}
            scores={scores}
            onNavigate={scrollToQuestion}
            currentIndex={currentIndex}
            flaggedQuestions={questionMarks.flaggedQuestions}
            showFeedback={!isExamMode || feedbackRevealed}
            language={quizInfo.language}
          />
        }
      />

      {/* Timer display for exam mode */}
      {settings.timerEnabled && !feedbackRevealed && (
        <div className="sticky top-35 z-10 bg-page border-b border-default">
          <div className="max-w-4xl mx-auto px-4 py-2 flex justify-end">
            <Timer
              formattedTime={timer.formattedTime}
              isRunning={timer.isRunning}
              isTimeUp={timer.isTimeUp}
              timeRemainingMs={timer.timeRemainingMs}
              onPause={timer.pause}
              onResume={timer.start}
              language={quizInfo.language}
            />
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Exam mode indicator */}
        {isExamMode && !feedbackRevealed && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                {t.examModeInfo}
              </span>
            </div>
          </div>
        )}

        {showCompletion && (
          <div className="mb-6">
            <ScoreSummary
              earnedPoints={stats.earnedPoints}
              maxPoints={stats.maxPoints}
              onReset={handleReset}
              onBack={onBack}
              language={quizInfo.language}
            />
          </div>
        )}

        <div className="space-y-6">
          {orderedQuestions.map((question, index) => (
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
                examMode={isExamMode}
                feedbackRevealed={feedbackRevealed}
                isFlagged={questionMarks.isFlagged(question.id)}
                onToggleFlag={() => questionMarks.toggleFlag(question.id)}
                isBookmarked={questionMarks.isBookmarked(question.id)}
                onToggleBookmark={() => questionMarks.toggleBookmark(question.id, question.question_text)}
                language={quizInfo.language}
              />
            </div>
          ))}
        </div>

        {/* Exam submit button */}
        {isExamMode && !feedbackRevealed && stats.answeredCount > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              {common.backToOverview}
            </button>
            <button
              onClick={handleSubmitExam}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                allAnswered
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
{allAnswered ? t.submitExam : t.submitEarly}
            </button>
          </div>
        )}

        {/* Practice mode buttons */}
        {!isExamMode && !showCompletion && stats.answeredCount > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              {common.backToOverview}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-error border border-error rounded-lg hover:bg-error transition-colors"
            >
              {common.restart}
            </button>
          </div>
        )}

        {!showCompletion && stats.answeredCount === 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onBack}
              className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-hover transition-colors"
            >
              {common.backToOverview}
            </button>
          </div>
        )}
      </main>

      <BackToTop language={quizInfo.language} />
    </div>
  );
}
