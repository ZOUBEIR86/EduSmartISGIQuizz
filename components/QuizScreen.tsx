
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (score: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isSkipConfirmOpen, setIsSkipConfirmOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const currentQuestion = questions[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      onFinish(score);
    }
  }, [currentIndex, score, onFinish, questions.length]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Giving more time to appreciate the animations
    setTimeout(handleNext, 2600);
  };

  const confirmSkip = () => {
    setIsSkipConfirmOpen(false);
    setIsAnswered(true);
    setTimeout(handleNext, 400);
  };

  const submitReport = () => {
    console.log('Question Report:', {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      reason: reportReason
    });
    setReportReason('');
    setIsReportModalOpen(false);
  };

  useEffect(() => {
    if (isAnswered) return;
    if (timeLeft === 0) {
      setIsAnswered(true);
      setTimeout(handleNext, 1500);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, handleNext]);

  const buttonMotionProps = {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 500, damping: 20 }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden w-full flex flex-col min-h-[600px] border border-white/50 relative">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 pb-12 relative">
        <div className="flex justify-between items-center text-white mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">En cours d'examen</p>
            <span className="text-xl font-black tracking-tight">{currentIndex + 1} <span className="text-sm opacity-50">/ {questions.length}</span></span>
          </div>
          <Timer duration={20} remaining={timeLeft} />
        </div>
        <ProgressBar progress={((currentIndex + 1) / questions.length) * 100} />
      </div>

      <div className="p-8 flex-grow flex flex-col gap-8 -mt-6 bg-white rounded-t-[2.5rem] z-10 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 flex-grow flex flex-col"
          >
            <h2 className="text-2xl font-black text-gray-800 text-center leading-[1.3] px-2 min-h-[80px] flex items-center justify-center">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-1 gap-4 flex-grow">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedOption;
                
                // Base classes
                let containerClass = 'bg-gray-50 border-gray-100';
                
                return (
                  <motion.button
                    key={`${currentIndex}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isAnswered
                        ? isCorrect && isSelected
                          ? { 
                              scale: [1, 1.08, 1.05], 
                              backgroundColor: "#ecfdf5",
                              borderColor: "#10b981",
                              boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
                              zIndex: 20
                            }
                          : isSelected && !isCorrect
                          ? { 
                              x: [0, -8, 8, -8, 8, 0],
                              backgroundColor: "#fff1f2",
                              borderColor: "#ef4444",
                              boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
                              zIndex: 20
                            }
                          : isCorrect && !isSelected
                          ? { 
                              borderColor: "#10b981",
                              backgroundColor: "rgba(16, 185, 129, 0.05)",
                              scale: 1.02,
                              opacity: 1
                            }
                          : { opacity: 0.3, scale: 0.95 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    transition={{
                      duration: isAnswered && isSelected && !isCorrect ? 0.4 : 0.5,
                      type: isAnswered && isCorrect && isSelected ? "spring" : "tween",
                      stiffness: 400,
                      damping: 15
                    }}
                    whileHover={!isAnswered ? { 
                      scale: 1.02, 
                      y: -2, 
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                      borderColor: "rgba(99, 102, 241, 0.4)"
                    } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(option)}
                    disabled={isAnswered}
                    className={`group p-5 rounded-2xl border-2 text-left font-bold transition-all ${containerClass} flex items-center justify-between relative overflow-hidden`}
                  >
                    <span className={`flex-grow pr-4 text-base ${
                      isAnswered && isCorrect ? 'text-emerald-700' : 
                      isAnswered && isSelected ? 'text-rose-700' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                    
                    <div className="flex-shrink-0">
                      <AnimatePresence>
                        {isAnswered && isCorrect && (
                          <motion.div 
                            initial={{ scale: 0, rotate: -45 }} 
                            animate={{ scale: 1.2, rotate: 0 }} 
                            className="text-emerald-600"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1.2 }} 
                            className="text-rose-600"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dynamic background effect for correct answer */}
                    {isAnswered && isCorrect && isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.2, 0], scale: [1, 2, 3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl pointer-events-none"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {!isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="pt-4 flex justify-center gap-4"
                >
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-rose-100 text-rose-300 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all group"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Signaler
                  </button>

                  <button
                    onClick={() => setIsSkipConfirmOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 hover:text-gray-500 transition-all group"
                  >
                    Passer
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSkipConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] border border-white"
            >
              <div className="w-20 h-20 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner border border-amber-100">
                ❓
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Êtes-vous sûr ?</h3>
              <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed px-4">
                Voulez-vous vraiment passer cette question ? Vous ne pourrez pas y revenir.
              </p>
              
              <div className="flex flex-col gap-3">
                <motion.button 
                  {...buttonMotionProps}
                  onClick={confirmSkip} 
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.2rem] font-black text-sm uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Confirmer
                </motion.button>
                <motion.button 
                  {...buttonMotionProps}
                  onClick={() => setIsSkipConfirmOpen(false)} 
                  className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {isReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-md shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] border border-white"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border border-rose-100">
                🚩
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight text-center">Signaler un problème</h3>
              <p className="text-gray-500 font-bold text-sm mb-6 leading-relaxed text-center px-4">
                Veuillez décrire brièvement le problème rencontré avec cette question.
              </p>
              
              <div className="space-y-4">
                <textarea
                  className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-rose-300 focus:bg-white rounded-2xl outline-none font-bold text-gray-700 shadow-inner min-h-[120px] transition-all"
                  placeholder="Erreur dans l'énoncé, options incorrectes, etc..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />

                <div className="flex flex-col gap-3">
                  <motion.button 
                    {...buttonMotionProps}
                    disabled={!reportReason.trim()}
                    onClick={submitReport} 
                    className="w-full py-5 bg-rose-600 text-white rounded-[1.2rem] font-black text-sm uppercase tracking-widest shadow-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer le signalement
                  </motion.button>
                  <motion.button 
                    {...buttonMotionProps}
                    onClick={() => {
                      setIsReportModalOpen(false);
                      setReportReason('');
                    }} 
                    className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Fermer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizScreen;
