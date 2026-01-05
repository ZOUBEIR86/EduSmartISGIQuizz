
export type AppState = 'role-selection' | 'welcome' | 'quiz' | 'result' | 'professor';

export type UserRole = 'student' | 'professor';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizData {
  filiere: string;
  module: string;
  questions: Question[];
}

export interface UserProgress {
  score: number;
  totalQuestions: number;
  filiere: string;
  module: string;
}

export enum Filiere {
  DEVELOPPEMENT_DIGITAL = 'Développement Digital',
  GESTION = 'Gestion',
  RESEAUX = 'Systèmes et Réseaux'
}
