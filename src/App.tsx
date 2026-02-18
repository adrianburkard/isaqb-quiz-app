import { useState } from 'react';
import { QuizSelection } from './components/QuizSelection';
import { QuizView } from './components/QuizView';
import { BookmarkedQuestions } from './components/BookmarkedQuestions';
import { HistoryView } from './components/HistoryView';
import { AttemptDetail } from './components/AttemptDetail';
import type { QuizInfo, Language } from './types';
import type { QuizAttempt } from './types/history';

type View = 'selection' | 'quiz' | 'bookmarks' | 'history' | 'attempt';

function App() {
  const [view, setView] = useState<View>('selection');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizInfo | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [language, setLanguage] = useState<Language>('de');

  const handleSelectQuiz = (quiz: QuizInfo) => {
    setLanguage(quiz.language);
    setSelectedQuiz(quiz);
    setView('quiz');
  };

  const handleBack = () => {
    setSelectedQuiz(null);
    setSelectedAttempt(null);
    setView('selection');
  };

  const handleViewAttempt = (attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
    setView('attempt');
  };

  const handleBackFromAttempt = () => {
    setSelectedAttempt(null);
    setView('history');
  };

  if (view === 'quiz' && selectedQuiz) {
    return (
      <QuizView
        quizInfo={selectedQuiz}
        onBack={handleBack}
      />
    );
  }

  if (view === 'bookmarks') {
    return (
      <BookmarkedQuestions
        language={language}
        onSelectQuiz={handleSelectQuiz}
        onBack={handleBack}
      />
    );
  }

  if (view === 'history') {
    return (
      <HistoryView
        language={language}
        onViewAttempt={handleViewAttempt}
        onBack={handleBack}
      />
    );
  }

  if (view === 'attempt' && selectedAttempt) {
    return (
      <AttemptDetail
        attempt={selectedAttempt}
        language={language}
        onBack={handleBackFromAttempt}
      />
    );
  }

  return (
    <QuizSelection
      onSelectQuiz={handleSelectQuiz}
      language={language}
      onLanguageChange={setLanguage}
      onShowBookmarks={() => setView('bookmarks')}
      onShowHistory={() => setView('history')}
    />
  );
}

export default App;
