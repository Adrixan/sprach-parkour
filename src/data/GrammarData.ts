export interface GrammarQuestion {
  id: string;
  difficulty: 'Primar' | 'Sekundar';
  sentence: string;
  options: string[];
  correctAnswer: string;
  feedback: string;
}

export const grammarData: GrammarQuestion[] = [
  {
    id: 'q1',
    difficulty: 'Primar',
    sentence: 'Der Parkour-Läufer springt ___ Mauer.',
    options: ['über die', 'über der', 'auf den'],
    correctAnswer: 'über die',
    feedback: 'Wohin springt er? Akkusativ: über die Mauer.'
  },
  {
    id: 'q2',
    difficulty: 'Primar',
    sentence: 'Ich laufe ___ Weg.',
    options: ['auf dem', 'auf den', 'in das'],
    correctAnswer: 'auf dem',
    feedback: 'Wo läuft er? Dativ: auf dem Weg.'
  },
  {
    id: 'q3',
    difficulty: 'Sekundar',
    sentence: 'Der Ball liegt ___ Tisch.',
    options: ['auf dem', 'auf den', 'unter das'],
    correctAnswer: 'auf dem',
    feedback: 'Wo liegt der Ball? Dativ: auf dem Tisch.'
  },
  {
    id: 'q4',
    difficulty: 'Sekundar',
    sentence: 'Das Kind klettert ___ Baum.',
    options: ['auf den', 'auf dem', 'in der'],
    correctAnswer: 'auf den',
    feedback: 'Wohin klettert es? Akkusativ: auf den Baum.'
  },
  {
    id: 'q5',
    difficulty: 'Primar',
    sentence: 'Der Hund rennt ___ Haus.',
    options: ['in das', 'in dem', 'auf das'],
    correctAnswer: 'in das',
    feedback: 'Wohin rennt der Hund? Akkusativ: in das Haus.'
  },
  {
    id: 'q6',
    difficulty: 'Sekundar',
    sentence: 'Wir stehen ___ Schule.',
    options: ['vor der', 'vor das', 'über die'],
    correctAnswer: 'vor der',
    feedback: 'Wo stehen wir? Dativ: vor der Schule.'
  },
  {
    id: 'q7',
    difficulty: 'Sekundar',
    sentence: 'Die Katze sitzt ___ Stuhl.',
    options: ['unter dem', 'unter den', 'in der'],
    correctAnswer: 'unter dem',
    feedback: 'Wo sitzt die Katze? Dativ: unter dem Stuhl.'
  },
  {
    id: 'q8',
    difficulty: 'Primar',
    sentence: 'Der Vogel fliegt ___ Wolke.',
    options: ['über die', 'über dem', 'unter die'],
    correctAnswer: 'über die',
    feedback: 'Wohin fliegt der Vogel? Akkusativ: über die Wolke.'
  }
];

export function getQuestionsByDifficulty(difficulty: 'Primar' | 'Sekundar'): GrammarQuestion[] {
  return grammarData.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestion(difficulty: 'Primar' | 'Sekundar'): GrammarQuestion {
  const questions = getQuestionsByDifficulty(difficulty);
  return questions[Math.floor(Math.random() * questions.length)];
}
