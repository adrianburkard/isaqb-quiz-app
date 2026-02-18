import { useState } from 'react';
import { QuizSelection } from './components/QuizSelection';
import { QuizView } from './components/QuizView';
import type { QuizInfo, Language } from './types';

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizInfo | null>(null);
  const [language, setLanguage] = useState<Language>('de');

  const handleSelectQuiz = (quiz: QuizInfo) => {
    setLanguage(quiz.language);
    setSelectedQuiz(quiz);
  };

  if (selectedQuiz) {
    return (
      <QuizView
        quizInfo={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <QuizSelection
      onSelectQuiz={handleSelectQuiz}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
}

export default App;
