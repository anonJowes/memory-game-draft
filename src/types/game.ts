export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: Card[];
  moves: number;
  time: number;
  difficulty: Difficulty;
  gameStarted: boolean;
  gameWon: boolean;
  bestScore?: { moves: number; time: number };
}

export const DIFFICULTY_CONFIG = {
  easy: { rows: 2, cols: 2 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 6, cols: 6 },
} as const;
