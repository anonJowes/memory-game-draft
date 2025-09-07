'use client';

import React from 'react';
import styles from './GameBoard.module.scss';
import Card from '../Card/Card';
import { Card as CardType, Difficulty, DIFFICULTY_CONFIG } from '../../types/game';

interface GameBoardProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
  disabled: boolean;
  difficulty: Difficulty;
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, onCardClick, disabled, difficulty }) => {
  const { rows, cols } = DIFFICULTY_CONFIG[difficulty];

  return (
    <div
      className={styles.gameBoard}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      aria-label="Memory game board"
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          disabled={disabled}
          difficulty={difficulty}
        />
      ))}
    </div>
  );
};

export default GameBoard;
