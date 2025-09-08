"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./App.module.scss";
import GameBoard from "./components/GameBoard/GameBoard";
import Controls from "./components/Controls/Controls";
import Timer from "./components/Timer/Timer";
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import {
  Card,
  GameState,
  Difficulty,
  DIFFICULTY_CONFIG,
  GameStatistics,
} from "./types/game";
import { shuffle } from "./utils/shuffle";
import { useTimer } from "./hooks/useTimer";
import { useSound } from "./hooks/useSound";

const generateCards = (difficulty: Difficulty): Card[] => {
  const { rows, cols } = DIFFICULTY_CONFIG[difficulty];
  const totalCards = rows * cols;
  const pairs = totalCards / 2;
  const imageList = [
    "/images/grid1.gif",
    "/images/grid2.gif",
    "/images/grid3.gif",
    "/images/grid4.gif",
    "/images/grid5.gif",
    "/images/grid6.gif",
    "/images/grid7.gif",
    "/images/grid8.gif",
    "/images/grid9.gif",
    "/images/grid10.gif",
    "/images/grid11.gif",
    "/images/grid12.gif",
    "/images/grid13.gif",
    "/images/grid14.gif",
    "/images/grid15.gif",
    "/images/grid16.gif",
    "/images/grid17.gif",
    "/images/grid18.gif",
  ];
  const values = imageList.slice(0, pairs);
  const cardValues = [...values, ...values];
  const shuffledValues = shuffle(cardValues);
  return shuffledValues.map((value, index) => ({
    id: `${index}`,
    value,
    isFlipped: false,
    isMatched: false,
  }));
};

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: [],
    flippedCards: [],
    moves: 0,
    time: 0,
    difficulty: "medium",
    gameStarted: false,
    gameWon: false,
  }));

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      cards: generateCards("medium"),
    }));
  }, []);

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      cards: generateCards(difficulty),
    }));
  }, [difficulty]);
  const { time, start, stop, reset } = useTimer();
  const { playCardFlip, playMatch, playNoMatch, playWin } = useSound();
  const [bestScore, setBestScore] = useState<
    { moves: number; time: number } | undefined
  >(undefined);
  const [statistics, setStatistics] = useState<GameStatistics>({
    gamesPlayed: 0,
    totalTime: 0,
    averageTime: 0,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("memoryGameBestScore");
    if (stored) {
      setBestScore(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const storedStats = localStorage.getItem("memoryGameStatistics");
    if (storedStats) {
      setStatistics(JSON.parse(storedStats));
    }
  }, []);

  const updateBestScore = useCallback(
    (moves: number, time: number) => {
      if (
        !bestScore ||
        moves < bestScore.moves ||
        (moves === bestScore.moves && time < bestScore.time)
      ) {
        const newBest = { moves, time };
        setBestScore(newBest);
        localStorage.setItem("memoryGameBestScore", JSON.stringify(newBest));
      }
    },
    [bestScore]
  );

  const updateStatistics = useCallback((time: number) => {
    setStatistics((prev) => {
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newTotalTime = prev.totalTime + time;
      const newAverageTime = newTotalTime / newGamesPlayed;
      const newStats = {
        gamesPlayed: newGamesPlayed,
        totalTime: newTotalTime,
        averageTime: newAverageTime,
      };
      localStorage.setItem("memoryGameStatistics", JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    stop();
    setLiveAnnouncement("Game paused");
  }, [stop]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    start();
    setLiveAnnouncement("Game resumed");
  }, [start]);

  const handleResetBestScore = useCallback(() => {
    setBestScore(undefined);
    localStorage.removeItem("memoryGameBestScore");
    setLiveAnnouncement("Best score has been reset");
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const handleCardClick = useCallback(
    (card: Card) => {
      if (isPaused) {
        setIsPaused(false);
        start();
      }
      setGameState((prev) => {
        if (
          prev.flippedCards.length === 2 ||
          prev.flippedCards.some((c) => c.id === card.id) ||
          card.isMatched
        ) {
          return prev;
        }

        const newFlippedCards = [...prev.flippedCards, card];
        const newCards = prev.cards.map((c) =>
          c.id === card.id ? { ...c, isFlipped: true } : c
        );

        if (soundEnabled) playCardFlip();

        if (newFlippedCards.length === 1 && !prev.gameStarted) {
          start();
        }

        if (newFlippedCards.length === 2) {
          const [first, second] = newFlippedCards;
          if (first.value === second.value) {
            // Match
            setLiveAnnouncement("Match found!");
            if (soundEnabled) playMatch();
            const matchedCards = newCards.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isMatched: true }
                : c
            );
            const allMatched = matchedCards.every((c) => c.isMatched);
            if (allMatched) {
              stop();
              updateBestScore(prev.moves + 1, time);
              updateStatistics(time);
              setLiveAnnouncement("Congratulations! You won the game!");
              if (soundEnabled) playWin();
            }
            return {
              ...prev,
              cards: matchedCards,
              flippedCards: [],
              moves: prev.moves + 1,
              gameWon: allMatched,
            };
          } else {
            // No match, flip back after delay
            if (soundEnabled) playNoMatch();
            setTimeout(() => {
              setGameState((current) => ({
                ...current,
                cards: current.cards.map((c) =>
                  c.id === first.id || c.id === second.id
                    ? { ...c, isFlipped: false }
                    : c
                ),
                flippedCards: [],
              }));
            }, 1000);
            return {
              ...prev,
              cards: newCards,
              flippedCards: newFlippedCards,
              moves: prev.moves + 1,
            };
          }
        }

        return {
          ...prev,
          cards: newCards,
          flippedCards: newFlippedCards,
        };
      });
    },
    [isPaused, setIsPaused, start, stop, updateBestScore, time, playCardFlip, playMatch, playNoMatch, playWin, soundEnabled, updateStatistics]
  );

  const handleRestart = useCallback(() => {
    reset();
    setGameState({
      cards: generateCards(difficulty),
      flippedCards: [],
      moves: 0,
      time: 0,
      difficulty,
      gameStarted: false,
      gameWon: false,
    });
  }, [difficulty, reset]);

  const handleDifficultyChange = useCallback(
    (newDifficulty: Difficulty) => {
      setDifficulty(newDifficulty);
      handleRestart();
    },
    [handleRestart]
  );

  useEffect(() => {
    if (gameState.gameWon) {
      // Announce win
      console.log("Game won!");
    }
  }, [gameState.gameWon]);

  return (
    <div className={styles.app}>
      <h1>Memory Game</h1>
      <div className={styles.gameContainer}>
        <div className={styles.gameBoardContainer}>
          <GameBoard
            cards={gameState.cards}
            onCardClick={handleCardClick}
            disabled={gameState.flippedCards.length === 2}
            difficulty={difficulty}
          />
        </div>
        <div className={styles.controlsContainer}>
          <DifficultySelector
            difficulty={difficulty}
            onChange={handleDifficultyChange}
          />
          <Timer time={time} />
          <Controls
            moves={gameState.moves}
            onRestart={handleRestart}
            bestScore={bestScore}
            onResetBestScore={handleResetBestScore}
            gamesPlayed={statistics.gamesPlayed}
            averageTime={statistics.averageTime}
            onPause={handlePause}
            onResume={handleResume}
            isPaused={isPaused}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            difficulty={difficulty}
          />

          {gameState.gameWon && (
            <div className={styles.winMessage}>Congratulations! You won!</div>
          )}
        </div>
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className={styles.liveRegion}
      >
        {liveAnnouncement}
      </div>
    </div>
  );
};

export default App;
