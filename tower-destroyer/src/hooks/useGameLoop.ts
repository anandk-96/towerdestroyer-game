import { useEffect, useRef, useCallback } from 'react';

interface GameLoopOptions {
  onTick: (deltaTime: number) => void;
  fps?: number;
}

export function useGameLoop({ onTick, fps = 60 }: GameLoopOptions) {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  const loop = useCallback((currentTime: number) => {
    if (!isRunningRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    const targetDelta = 1000 / fps;

    if (deltaTime >= targetDelta) {
      onTick(deltaTime);
      lastTimeRef.current = currentTime;
    }

    frameRef.current = requestAnimationFrame(loop);
  }, [onTick, fps]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop };
}
