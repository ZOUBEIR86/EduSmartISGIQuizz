
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FILIERES, MODULES_BY_FILIERE } from '../constants';
import { Filiere } from '../types';

interface WelcomeScreenProps {
  onStart: (filiere: string, module: string) => void;
  onBack: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onBack }) => {
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | ''>('');
  const [selectedModule, setSelectedModule] = useState<string>('');

  const handleStart = () => {
    if (selectedFiliere && selectedModule) {
      onStart(selectedFiliere, selectedModule);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center gap-6 w-full border border-white/50 relative"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-indigo-400 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
      </button>

      <motion.div 
        variants={itemVariants}
        className="w-20 h-20 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-lg relative mt-4"
      >
        <span className="text-4xl z-10">🚀</span>
      </motion.div>
      
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Prêt au Décollage</h1>
        <p className="text-indigo-500 mt-1 font-bold uppercase tracking-widest text-[9px]">Configurez votre session</p>
      </motion.div>

      <div className="w-full space-y-5">
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
            Votre Spécialité
          </label>
          <select 
            className="w-full p-4 bg-indigo-50/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none appearance-none transition-all font-bold text-gray-700 shadow-sm"
            value={selectedFiliere}
            onChange={(e) => {
              setSelectedFiliere(e.target.value as Filiere);
              setSelectedModule('');
            }}
          >
            <option value="">Sélectionner une filière</option>
            {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </motion.div>

        <AnimatePresence>
          {selectedFiliere && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <label className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
                Module de Quiz
              </label>
              <select 
                className="w-full p-4 bg-indigo-50/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none appearance-none transition-all font-bold text-gray-700 shadow-sm"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
              >
                <option value="">Sélectionner un module</option>
                {MODULES_BY_FILIERE[selectedFiliere as Filiere].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        variants={itemVariants}
        disabled={!selectedFiliere || !selectedModule}
        whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(79 70 229 / 0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStart}
        className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all relative overflow-hidden mt-2 ${
          selectedFiliere && selectedModule 
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        DÉMARRER L'EXAMEN
      </motion.button>
    </motion.div>
  );
};

export default WelcomeScreen;
