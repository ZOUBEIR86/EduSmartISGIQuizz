
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FILIERES, MODULES_BY_FILIERE } from '../constants';
import { Filiere, Question } from '../types';

interface ProfessorDashboardProps {
  onBack: () => void;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ onBack }) => {
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | ''>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const handleSave = () => {
    setError(null);
    
    const trimmedText = newQuestion.text?.trim() || '';
    const validOptions = (newQuestion.options || []).map(o => o.trim()).filter(o => o !== '');
    const trimmedCorrect = newQuestion.correctAnswer?.trim() || '';

    if (!selectedModule) {
      setError("Veuillez sélectionner un module cible avant d'ajouter une question.");
      return;
    }

    if (!trimmedText) {
      setError("L'énoncé de la question ne peut pas être vide.");
      return;
    }

    if (validOptions.length < 2) {
      setError("Veuillez fournir au moins deux options de réponse.");
      return;
    }

    if (!trimmedCorrect) {
      setError("Veuillez spécifier la réponse correcte.");
      return;
    }

    if (!validOptions.includes(trimmedCorrect)) {
      setError("La réponse attendue doit correspondre exactement à l'une des options proposées.");
      return;
    }

    const key = `custom_questions_${selectedModule}`;
    const existing = localStorage.getItem(key);
    const questions: Question[] = existing ? JSON.parse(existing) : [];
    
    const questionToSave: Question = {
      id: Date.now(),
      text: trimmedText,
      options: validOptions,
      correctAnswer: trimmedCorrect
    };

    localStorage.setItem(key, JSON.stringify([...questions, questionToSave]));
    setIsAdding(false);
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
    setError(null);
    alert('Question ajoutée avec succès !');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setError(null);
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 w-full border border-white/50 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-indigo-400 hover:text-indigo-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-gray-900">Labo de Quiz</h2>
        <div className="w-6" />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-2">Spécialisation</label>
          <select 
            className="w-full p-4 bg-indigo-50/50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-indigo-500 shadow-sm"
            value={selectedFiliere}
            onChange={(e) => {
              setSelectedFiliere(e.target.value as Filiere);
              setSelectedModule('');
              setError(null);
            }}
          >
            <option value="">Sélectionner une filière</option>
            {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {selectedFiliere && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-2">Module Cible</label>
            <select 
              className="w-full p-4 bg-indigo-50/50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-indigo-500 shadow-sm"
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setError(null);
              }}
            >
              <option value="">Sélectionner un module</option>
              {MODULES_BY_FILIERE[selectedFiliere as Filiere].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isAdding ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            disabled={!selectedModule}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(79 70 229 / 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide transition-all"
          >
            + NOUVELLE QUESTION
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4 bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50"
          >
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-bold border border-rose-100 flex items-start gap-3 overflow-hidden"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              placeholder="Énoncé de la question..."
              className="w-full p-4 rounded-xl border-none outline-none font-bold text-sm min-h-[100px] shadow-inner focus:ring-2 focus:ring-indigo-300 transition-all"
              value={newQuestion.text}
              onChange={e => {
                setNewQuestion({...newQuestion, text: e.target.value});
                if (error) setError(null);
              }}
            />
            <div className="grid grid-cols-1 gap-2">
              {newQuestion.options?.map((opt, idx) => (
                <input
                  key={idx}
                  placeholder={`Choix ${idx + 1}`}
                  className="w-full p-3 rounded-xl border-none outline-none text-sm font-medium shadow-sm focus:ring-2 focus:ring-indigo-300 transition-all"
                  value={opt}
                  onChange={e => {
                    const newOpts = [...(newQuestion.options || [])];
                    newOpts[idx] = e.target.value;
                    setNewQuestion({...newQuestion, options: newOpts});
                    if (error) setError(null);
                  }}
                />
              ))}
            </div>
            <div className="space-y-1 pt-2">
              <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-2">Réponse attendue</label>
              <input
                placeholder="Copiez la réponse exacte ici"
                className="w-full p-4 rounded-xl bg-emerald-50 text-emerald-800 border-2 border-emerald-100 outline-none font-bold text-sm focus:ring-2 focus:ring-emerald-300 transition-all placeholder:text-emerald-300"
                value={newQuestion.correctAnswer}
                onChange={e => {
                  setNewQuestion({...newQuestion, correctAnswer: e.target.value});
                  if (error) setError(null);
                }}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleSave}
                className="flex-grow py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-black transition-colors"
              >
                PUBLIER
              </button>
              <button 
                onClick={handleCancel}
                className="px-6 py-4 bg-gray-200 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-300 transition-colors"
              >
                RETOUR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <div className="inline-block p-2 px-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-[9px] text-amber-700 font-black uppercase tracking-widest">
            💡 Stockage local actif sur cet appareil
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
