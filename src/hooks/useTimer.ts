import { useState, useEffect, useRef } from "react";

const useTimer = (initialTime: number, onTimerEnd?: () => void) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current + "");
      if (onTimerEnd) {
        onTimerEnd();
      }
    } else if (!isRunning) {
      clearInterval(intervalRef.current + "");
    }

    return () => clearInterval(intervalRef.current + "");
  }, [isRunning, time, onTimerEnd]);

  const resetTimer = () => {
    setTime(initialTime);
    setIsRunning(true);
  };

  const pauseResumeTimer = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const startTimer = () => {
    setTime(initialTime);
    setIsRunning(true);
  };

  return {
    time: formatTime(time),
    timeInms: time,
    isRunning,
    resetTimer,
    pauseResumeTimer,
    startTimer,
  };
};

export default useTimer;
