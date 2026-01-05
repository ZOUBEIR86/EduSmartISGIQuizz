
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProgress } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ResultScreenProps {
  progress: UserProgress;
  onRestart: () => void;
  onHome: () => void;
}

type ConfirmTarget = 'restart' | 'home' | null;

const AnimatedScore: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const totalDuration = 1200;
    const increment = end / (totalDuration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ progress, onRestart, onHome }) => {
  const [motivation, setMotivation] = useState<string>("Analyse de vos résultats...");
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null);
  const percentage = Math.round((progress.score / progress.totalQuestions) * 100);

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Génère une phrase d'encouragement très courte (max 10 mots) pour un étudiant qui a eu ${progress.score}/${progress.totalQuestions} au module ${progress.module}.`;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        setMotivation(response.text || "Continuez vos efforts !");
      } catch (e) {
        setMotivation(percentage >= 70 ? "Excellent travail !" : "Continuez vos révisions, vous y êtes presque.");
      }
    };
    fetchMotivation();
  }, [progress, percentage]);

  const handleConfirmAction = () => {
    if (confirmTarget === 'restart') onRestart();
    else if (confirmTarget === 'home') onHome();
    setConfirmTarget(null);
  };

  const themeClasses = {
    emerald: { 
      bg: 'bg-emerald-500', 
      text: 'text-emerald-600', 
      btn: 'bg-emerald-600 hover:bg-emerald-700', 
      icon: '🏆', 
      tint: 'bg-emerald-50',
      border: 'border-emerald-100',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    blue: { 
      bg: 'bg-blue-500', 
      text: 'text-blue-600', 
      btn: 'bg-blue-600 hover:bg-blue-700', 
      icon: '🥈', 
      tint: 'bg-blue-50',
      border: 'border-blue-100',
      glow: 'rgba(37, 99, 235, 0.4)'
    },
    rose: { 
      bg: 'bg-rose-500', 
      text: 'text-rose-600', 
      btn: 'bg-rose-600 hover:bg-rose-700', 
      icon: '📚', 
      tint: 'bg-rose-50',
      border: 'border-rose-100',
      glow: 'rgba(225, 29, 72, 0.4)'
    }
  };

  const themeKey = percentage >= 80 ? 'emerald' : percentage >= 50 ? 'blue' : 'rose';
  const currentTheme = themeClasses[themeKey];

  // Professional Hover Animation Props
  const buttonMotionProps = {
    whileHover: { 
      scale: 1.03,
      y: -4,
      boxShadow: `0 20px 25px -5px ${currentTheme.glow}, 0 10px 10px -5px rgba(0, 0, 0, 0.1)`,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    whileTap: { scale: 0.97, y: 0 },
    transition: { type: "spring", stiffness: 500, damping: 25 }
  };

  const subtleButtonMotionProps = {
    whileHover: { 
      scale: 1.02,
      y: -2,
      backgroundColor: "rgba(0,0,0,0.04)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
      transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    whileTap: { scale: 0.98, y: 0 },
    transition: { type: "spring", stiffness: 500, damping: 25 }
  };

  return (
    <div className="relative w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 flex flex-col items-center gap-6 w-full border border-white/60"
      >
        <div className={`w-28 h-28 ${currentTheme.tint} rounded-[2.2rem] flex items-center justify-center text-6xl shadow-inner border border-white relative overflow-hidden`}>
          <div className={`absolute inset-0 opacity-10 ${currentTheme.bg}`} />
          <span className="relative z-10">{currentTheme.icon}</span>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">C'est terminé !</h2>
          <div className="inline-block mt-3 px-5 py-1.5 bg-gray-100/80 rounded-full border border-gray-200/50">
            <p className="text-gray-500 font-black uppercase tracking-widest text-[11px]">{progress.module}</p>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 bg-gray-50/70 p-7 rounded-[2rem] border border-gray-200/50 shadow-sm">
          <div className="text-center border-r border-gray-200">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Score final</p>
            <p className={`text-5xl font-black ${currentTheme.text} tracking-tighter`}>
              <AnimatedScore value={progress.score} />
              <span className="text-xl opacity-30 font-bold ml-0.5">/{progress.totalQuestions}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Précision</p>
            <p className="text-5xl font-black text-gray-800 tracking-tighter">
              <AnimatedScore value={percentage} />%
            </p>
          </div>
        </div>

        <div className="bg-indigo-50/60 p-7 rounded-[2rem] w-full border border-indigo-100/50 shadow-inner">
          <p className="text-indigo-900 text-sm font-bold italic text-center leading-relaxed">
            "{motivation}"
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <motion.button
            {...buttonMotionProps}
            onClick={() => setConfirmTarget('restart')}
            className={`w-full py-5 ${currentTheme.btn} text-white rounded-[1.5rem] font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            RESTART QUIZ
          </motion.button>
          
          <motion.button
            {...subtleButtonMotionProps}
            onClick={() => setConfirmTarget('home')}
            className="w-full py-4 text-gray-400 font-black text-[11px] uppercase tracking-[0.2em] transition-colors rounded-xl"
          >
            Quitter le module
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] border border-white"
            >
              <div className="w-20 h-20 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner border border-amber-100">
                ⚠️
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Êtes-vous sûr ?</h3>
              <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed px-4">
                {confirmTarget === 'restart' 
                  ? 'Voulez-vous vraiment recommencer ce quiz ? Votre score actuel sera perdu.' 
                  : 'Voulez-vous retourner à l\'accueil ? Votre progression ne sera pas sauvegardée.'}
              </p>
              
              <div className="flex flex-col gap-3">
                <motion.button 
                  {...buttonMotionProps}
                  onClick={handleConfirmAction} 
                  className={`w-full py-5 ${confirmTarget === 'restart' ? currentTheme.btn : 'bg-gray-900 hover:bg-black'} text-white rounded-[1.2rem] font-black text-sm uppercase tracking-widest shadow-lg`}
                >
                  {confirmTarget === 'restart' ? 'YES, RESTART NOW' : 'OUI, JE CONFIRME'}
                </motion.button>
                <motion.button 
                  {...subtleButtonMotionProps}
                  onClick={() => setConfirmTarget(null)} 
                  className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-widest rounded-xl"
                >
                  ANNULER
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultScreen;
