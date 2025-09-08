"use client";

import React from "react";
import styles from "./Controls.module.scss";

import { Difficulty } from "../../types/game";

interface ControlsProps {
  moves: number;
  onRestart: () => void;
  bestScore?: { moves: number; time: number };
  onResetBestScore?: () => void;
  gamesPlayed?: number;
  averageTime?: number;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  difficulty: Difficulty;
}

const Controls: React.FC<ControlsProps> = ({
  moves,
  onRestart,
  bestScore,
  onResetBestScore,
  gamesPlayed,
  averageTime,
  onPause,
  onResume,
  isPaused,
  soundEnabled,
  onToggleSound,
  difficulty,
}) => {
  return (
    <div
      className={`${styles.controls} ${
        difficulty === "easy" ? styles.easyControls : ""
      }`}
    >
      <div
        className={styles.moves}
        aria-live="polite"
        aria-label={`Moves: ${moves}`}
      >
        Moves: {moves}
      </div>
      {onToggleSound && (
        <button
          onClick={onToggleSound}
          className={styles.soundToggleButton}
          aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
      )}
      {bestScore && (
        <div className={styles.bestScore}>
          Best: {bestScore.moves} moves, {Math.floor(bestScore.time / 60)}:
          {(bestScore.time % 60).toString().padStart(2, "0")}
        </div>
      )}
      {gamesPlayed !== undefined && (
        <div
          className={styles.statistics}
          aria-live="polite"
          aria-label={`Games played: ${gamesPlayed}, Average time: ${Math.floor(
            averageTime || 0
          )} seconds`}
        >
          Games Played: {gamesPlayed}, Average Time:{" "}
          {Math.floor(averageTime || 0)}s
        </div>
      )}
      <div className={styles.btns}>
        <button
          onClick={onRestart}
          className={styles.restartButton}
          aria-label="Restart game"
        >
          Restart
        </button>
        {onResetBestScore && (
          <button
            onClick={onResetBestScore}
            className={styles.resetBestScoreButton}
            aria-label="Reset best score"
          >
            Reset Best Score
          </button>
        )}
        {onPause && onResume && (
          <button
            onClick={isPaused ? onResume : onPause}
            className={styles.pauseResumeButton}
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;
