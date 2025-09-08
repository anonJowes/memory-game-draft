'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      let newIndex = focusedCardIndex;
      const totalCards = cards.length;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newIndex = focusedCardIndex - cols;
          if (newIndex < 0) newIndex = focusedCardIndex + (rows - 1) * cols;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = focusedCardIndex + cols;
          if (newIndex >= totalCards) newIndex = focusedCardIndex % cols;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = focusedCardIndex - 1;
          if (newIndex < 0) newIndex = totalCards - 1;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newIndex = focusedCardIndex + 1;
          if (newIndex >= totalCards) newIndex = 0;
          break;
        case 'Alt':
          e.preventDefault();
          // Alt key for selection, but since focus is already selection, perhaps not needed
          break;
        default:
          return;
      }

      setFocusedCardIndex(newIndex);
      // Focus the new card
      const cardElements = gameBoardRef.current?.querySelectorAll('[role="button"]');
      if (cardElements && cardElements[newIndex]) {
        (cardElements[newIndex] as HTMLElement).focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedCardIndex, cards.length, cols, rows, disabled]);

  const handleCardClick = (card: CardType, index: number) => {
    setFocusedCardIndex(index);
    onCardClick(card);
  };

  return (
    <div
      ref={gameBoardRef}
      className={styles.gameBoard}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      aria-label="Memory game board"
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => handleCardClick(card, index)}
          disabled={disabled}
          difficulty={difficulty}
        />
      ))}
    </div>
  );
};

export default GameBoard;
