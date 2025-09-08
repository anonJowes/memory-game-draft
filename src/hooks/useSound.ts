import { useCallback, useRef } from 'react';
import { WindowWithWebkit } from '../types/index';

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as WindowWithWebkit).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Silently fail if Web Audio API is not supported
    }
  }, [getAudioContext]);

  const playCardFlip = useCallback(() => playTone(800, 0.1, 'square'), [playTone]);
  const playMatch = useCallback(() => {
    playTone(600, 0.15, 'sine');
    setTimeout(() => playTone(800, 0.15, 'sine'), 100);
  }, [playTone]);
  const playNoMatch = useCallback(() => playTone(300, 0.3, 'sawtooth'), [playTone]);
  const playWin = useCallback(() => {
    playTone(523, 0.2, 'sine'); // C5
    setTimeout(() => playTone(659, 0.2, 'sine'), 150); // E5
    setTimeout(() => playTone(784, 0.3, 'sine'), 300); // G5
  }, [playTone]);

  return {
    playCardFlip,
    playMatch,
    playNoMatch,
    playWin,
  };
};
