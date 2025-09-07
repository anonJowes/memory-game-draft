'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './App.module.scss';
import GameBoard from './components/GameBoard/GameBoard';
import Controls from './components/Controls/Controls';
import Timer from './components/Timer/Timer';
import DifficultySelector from './components/DifficultySelector/DifficultySelector';
import { Card, GameState, Difficulty, DIFFICULTY_CONFIG } from './types/game';
import { shuffle } from './utils/shuffle';
import { useTimer } from './hooks/useTimer';

const generateCards = (difficulty: Difficulty): Card[] => {
  const { rows, cols } = DIFFICULTY_CONFIG[difficulty];
  const totalCards = rows * cols;
  const pairs = totalCards / 2;
  // List of GIF images (assuming they exist in public/images/)
  const imageList = [
    '/images/grid1.gif',
    '/images/grid2.gif',
    '/images/grid3.gif',
    '/images/grid4.gif',
    '/images/grid5.gif',
    '/images/grid6.gif',
    '/images/grid7.gif',
    '/images/grid8.gif',
    '/images/grid9.gif',
    '/images/grid10.gif',
    '/images/grid11.gif',
    '/images/grid12.gif',
    '/images/grid13.gif',
    '/images/grid14.gif',
    '/images/grid15.gif',
    '/images/grid16.gif',
    '/images/grid17.gif',
    '/images/grid18.gif',
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
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: [],
    flippedCards: [],
    moves: 0,
    time: 0,
    difficulty: 'medium',
    gameStarted: false,
    gameWon: false,
  }));

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      cards: generateCards('medium'),
    }));
  }, []);

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      cards: generateCards(difficulty),
    }));
  }, [difficulty]);
  const { time, start, stop, reset } = useTimer();
  const [bestScore, setBestScore] = useState<{ moves: number; time: number } | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem('memoryGameBestScore');
    if (stored) {
      setBestScore(JSON.parse(stored));
    }
  }, []);

  const updateBestScore = useCallback((moves: number, time: number) => {
    if (!bestScore || moves < bestScore.moves || (moves === bestScore.moves && time < bestScore.time)) {
      const newBest = { moves, time };
      setBestScore(newBest);
      localStorage.setItem('memoryGameBestScore', JSON.stringify(newBest));
    }
  }, [bestScore]);

  const handleCardClick = useCallback((card: Card) => {
    setGameState((prev) => {
      if (prev.flippedCards.length === 2 || prev.flippedCards.some((c) => c.id === card.id) || card.isMatched) {
        return prev;
      }

      const newFlippedCards = [...prev.flippedCards, card];
      const newCards = prev.cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );

      if (newFlippedCards.length === 1 && !prev.gameStarted) {
        start();
      }

      if (newFlippedCards.length === 2) {
        const [first, second] = newFlippedCards;
        if (first.value === second.value) {
          // Match
          const matchedCards = newCards.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, isMatched: true } : c
          );
          const allMatched = matchedCards.every((c) => c.isMatched);
          if (allMatched) {
            stop();
            updateBestScore(prev.moves + 1, time);
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
          setTimeout(() => {
            setGameState((current) => ({
              ...current,
              cards: current.cards.map((c) =>
                c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
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
  }, [start, stop, updateBestScore, time]);

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

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    handleRestart();
  }, [handleRestart]);

  useEffect(() => {
    if (gameState.gameWon) {
      // Announce win
      console.log('Game won!');
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
          <DifficultySelector difficulty={difficulty} onChange={handleDifficultyChange} />
          <Controls moves={gameState.moves} onRestart={handleRestart} bestScore={bestScore} />
          <Timer time={time} />
          {gameState.gameWon && <div className={styles.winMessage}>Congratulations! You won!</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
