
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import ProfessorDashboard from './components/ProfessorDashboard';
import RoleSelection from './components/RoleSelection';
import { AppState, UserProgress, Question, UserRole } from './types';
import { QUESTIONS_BY_MODULE, DEFAULT_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('role-selection');
  const [role, setRole] = useState<UserRole | null>(null);
  const [selection, setSelection] = useState<{ filiere: string, module: string }>({
    filiere: '',
    module: ''
  });
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  // Generate a fixed set of particles to avoid re-renders during app use
  const backgroundParticles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
    }));
  }, []);

  /**
   * Role-based Access Control (RBAC) Security Guard
   */
  useEffect(() => {
    if (view === 'professor' && role !== 'professor') {
      console.warn("Accès non autorisé au tableau de bord professeur. Redirection de sécurité...");
      if (role === 'student') {
        setView('welcome');
      } else {
        setView('role-selection');
      }
    }
  }, [view, role]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'professor') {
      setView('professor');
    } else {
      setView('welcome');
    }
  };

  const startQuiz = (filiere: string, module: string) => {
    const localQuestions = localStorage.getItem(`custom_questions_${module}`);
    const questions = localQuestions ? JSON.parse(localQuestions) : (QUESTIONS_BY_MODULE[module] || DEFAULT_QUESTIONS);
    
    setSelection({ filiere, module });
    setCurrentQuestions(questions);
    setView('quiz');
  };

  const finishQuiz = (score: number) => {
    setProgress({
      score,
      totalQuestions: currentQuestions.length,
      filiere: selection.filiere,
      module: selection.module
    });
    setView('result');
  };

  const restartSameQuiz = () => {
    setProgress(null);
    setView('quiz');
  };

  const goHome = () => {
    setView('role-selection');
    setRole(null);
    setProgress(null);
    setCurrentQuestions([]);
    setSelection({ filiere: '', module: '' });
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* --- Abstract Background Layer --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Slow drifting particles */}
        {backgroundParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: `${p.x}%`, y: `${p.y}%` }}
            animate={{ 
              opacity: [0, 0.4, 0],
              y: [`${p.y}%`, `${(p.y + 15) % 100}%`],
              x: [`${p.x}%`, `${(p.x + 5) % 100}%`]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              delay: p.delay,
              ease: "linear"
            }}
            style={{ 
              width: p.size, 
              height: p.size, 
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              filter: 'blur(1px)'
            }}
            className="absolute"
          />
        ))}

        {/* Large Primary Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/15 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-500/15 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] right-[10%] w-[25%] h-[25%] bg-indigo-400/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- App Content Layer --- */}
      <div className="w-full max-w-lg z-10 relative">
        <AnimatePresence mode="wait">
          {view === 'role-selection' && (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <RoleSelection onSelect={handleRoleSelect} />
            </motion.div>
          )}

          {view === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full"
            >
              <WelcomeScreen onStart={startQuiz} onBack={() => setView('role-selection')} />
            </motion.div>
          )}

          {view === 'professor' && role === 'professor' && (
            <motion.div
              key="professor"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full"
            >
              <ProfessorDashboard onBack={goHome} />
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              <QuizScreen questions={currentQuestions} onFinish={finishQuiz} />
            </motion.div>
          )}

          {view === 'result' && progress && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <ResultScreen 
                progress={progress} 
                onRestart={restartSameQuiz} 
                onHome={goHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
