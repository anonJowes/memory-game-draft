'use client';

import React from 'react';
import styles from './DifficultySelector.module.scss';
import { Difficulty } from '../../types/game';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, onChange }) => {
  return (
    <div className={styles.difficultySelector}>
      <label htmlFor="difficulty-select">Difficulty:</label>
      <select
        id="difficulty-select"
        value={difficulty}
        onChange={(e) => onChange(e.target.value as Difficulty)}
        aria-label="Select game difficulty"
      >
        <option value="easy">Easy (2×2)</option>
        <option value="medium">Medium (4×4)</option>
        <option value="hard">Hard (6×6)</option>
      </select>
    </div>
  );
};

export default DifficultySelector;
