import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { quizQuestions, motivationalQuotes } from '../data/quizData';
import confetti from 'canvas-confetti';

const DailyTest = ({ domain, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = quizQuestions[domain] || quizQuestions['Coding'];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerIndex) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (answerIndex === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
      if (score + (selectedAnswer === currentQuestion.correct ? 1 : 0) === questions.length) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const finalScore = showResult ? score + (selectedAnswer === currentQuestion.correct ? 1 : 0) : score;
  const percentage = questions.length > 0 ? Math.round((finalScore / questions.length) * 100) : 0;

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {percentage === 100 ? '🎉' : percentage >= 70 ? '🎊' : '📚'}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2 gradient-text">Quiz Complete!</h2>
          <p className="text-lg mb-4">
            You scored <span className="font-bold text-purple-600 dark:text-purple-400">{finalScore}</span> out of{' '}
            <span className="font-bold">{questions.length}</span>
          </p>
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{percentage}% Correct</p>
          </div>
          <p className="text-purple-600 dark:text-purple-400 font-semibold mb-4">
            {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Continue Learning
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Daily Test</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {currentQuestion.question}
        </h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              whileHover={{ scale: answered ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                answered && index === currentQuestion.correct
                  ? 'bg-green-500 text-white'
                  : answered && index === selectedAnswer && index !== currentQuestion.correct
                  ? 'bg-red-500 text-white'
                  : selectedAnswer === index
                  ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500'
                  : 'bg-white/50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && index === currentQuestion.correct && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {answered && index === selectedAnswer && index !== currentQuestion.correct && (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </p>
        </motion.div>
      )}

      {answered && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {currentQuestionIndex < questions.length - 1 ? (
            <>
              Next Question <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            'View Results'
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default DailyTest;
