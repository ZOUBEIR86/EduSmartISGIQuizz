
import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">ISGI Academy</h1>
        <p className="text-white/80 font-bold uppercase tracking-widest text-[11px] mt-3">Portail d'apprentissage intelligent</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 w-full">
        <motion.button
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('student')}
          className="relative overflow-hidden group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-[2.5rem] shadow-2xl border border-white/40 text-left transition-all hover:shadow-blue-500/25"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
              🎓
            </div>
            <h2 className="text-2xl font-black text-gray-800">Espace Étudiant</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Prêt pour un quiz ? Testez vos limites dès maintenant.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-400/20 transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('professor')}
          className="relative overflow-hidden group bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-[2.5rem] shadow-2xl border border-white/40 text-left transition-all hover:shadow-indigo-500/25"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-indigo-700 text-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
              👨‍🏫
            </div>
            <h2 className="text-2xl font-black text-gray-800">Espace Professeur</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Gérez vos modules et analysez les performances.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-indigo-400/20 transition-colors" />
        </motion.button>
      </div>
    </div>
  );
};

export default RoleSelection;
