'use client';

import React from 'react';
import styles from './Card.module.scss';
import { Card as CardType, Difficulty } from '../../types/game';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
  disabled: boolean;
  difficulty: Difficulty;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled, difficulty }) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${styles.card} ${styles[difficulty]} ${card.isFlipped || card.isMatched ? styles.flipped : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      aria-label={`Card ${card.value}`}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardBack}>?</div>
        <div className={styles.cardFront}>
          <img src={card.value} alt="card" className={styles.cardImage} />
        </div>
      </div>
    </div>
  );
};

export default Card;
