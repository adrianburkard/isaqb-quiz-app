import { useState } from 'react';
import { QuizSelection } from './components/QuizSelection';
import { QuizView } from './components/QuizView';
import type { QuizInfo } from './types';

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizInfo | null>(null);

  if (selectedQuiz) {
    return (
      <QuizView
        quizInfo={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return <QuizSelection onSelectQuiz={setSelectedQuiz} />;
}

export default App;
