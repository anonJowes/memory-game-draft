import React from 'react';
import styles from './Timer.module.scss';

interface TimerProps {
  time: number;
}

const Timer: React.FC<TimerProps> = ({ time }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.timer} aria-live="polite" aria-label={`Time elapsed: ${formatTime(time)}`}>
      <span>Time: {formatTime(time)}</span>
    </div>
  );
};

export default Timer;
