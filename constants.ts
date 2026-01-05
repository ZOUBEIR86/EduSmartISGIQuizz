
import { Filiere, Question } from './types';

export const FILIERES = [
  Filiere.DEVELOPPEMENT_DIGITAL,
  Filiere.GESTION,
  Filiere.RESEAUX
];

export const MODULES_BY_FILIERE: Record<Filiere, string[]> = {
  [Filiere.DEVELOPPEMENT_DIGITAL]: ['HTML/CSS', 'JavaScript', 'Python', 'React.js'],
  [Filiere.GESTION]: ['Comptabilité', 'Marketing', 'Économie'],
  [Filiere.RESEAUX]: ['Cisco CCNA', 'Linux Administration', 'Sécurité']
};

export const QUESTIONS_BY_MODULE: Record<string, Question[]> = {
  'HTML/CSS': [
    { id: 1, text: "Que signifie HTML ?", options: ["HyperText Markup Language", "HyperTech Main Link", "High Text Machine", "Hyperlink Text"], correctAnswer: "HyperText Markup Language" },
    { id: 2, text: "Quelle propriété change la couleur du texte ?", options: ["font-color", "text-color", "color", "background-color"], correctAnswer: "color" },
    { id: 3, text: "Quelle balise pour un titre de niveau 1 ?", options: ["<h1>", "<title>", "<head>", "<header>"], correctAnswer: "<h1>" }
  ],
  'Python': [
    { id: 1, text: "Comment déclare-t-il une fonction en Python ?", options: ["function name():", "def name():", "void name():", "func name():"], correctAnswer: "def name():" },
    { id: 2, text: "Quel est le résultat de 3 ** 2 ?", options: ["6", "9", "5", "12"], correctAnswer: "9" },
    { id: 3, text: "Quelle structure est immuable ?", options: ["List", "Dictionary", "Tuple", "Set"], correctAnswer: "Tuple" }
  ],
  'Comptabilité': [
    { id: 1, text: "Quel est le principe de la partie double ?", options: ["Débit = Crédit", "Actif = Passif", "Ventes = Achats", "Recettes = Dépenses"], correctAnswer: "Débit = Crédit" },
    { id: 2, text: "Le bilan est un document qui décrit :", options: ["Le résultat", "Le patrimoine", "Les flux de trésorerie", "Les ventes"], correctAnswer: "Le patrimoine" },
    { id: 3, text: "Un amortissement est :", options: ["Une entrée d'argent", "Une perte de valeur", "Une dette", "Un gain de capital"], correctAnswer: "Une perte de valeur" }
  ],
  'JavaScript': [
    { id: 1, text: "Comment écrit-on 'Hello World' en alert ?", options: ["msg('Hello')", "alert('Hello World')", "prompt('Hello')", "console.log('Hello')"], correctAnswer: "alert('Hello World')" }
  ]
};

// Fallback pour les modules sans questions définies encore
export const DEFAULT_QUESTIONS: Question[] = [
  { id: 0, text: "Chargement des questions pour ce module...", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option A" }
];
