'use client';

import React from 'react';
import styles from './Controls.module.scss';

interface ControlsProps {
  moves: number;
  onRestart: () => void;
  bestScore?: { moves: number; time: number };
}

const Controls: React.FC<ControlsProps> = ({ moves, onRestart, bestScore }) => {
  return (
    <div className={styles.controls}>
      <div className={styles.moves} aria-live="polite" aria-label={`Moves: ${moves}`}>
        Moves: {moves}
      </div>
      {bestScore && (
        <div className={styles.bestScore}>
          Best: {bestScore.moves} moves, {Math.floor(bestScore.time / 60)}:{(bestScore.time % 60).toString().padStart(2, '0')}
        </div>
      )}
      <button onClick={onRestart} className={styles.restartButton}>
        Restart
      </button>
    </div>
  );
};

export default Controls;
