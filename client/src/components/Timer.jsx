import React, 'react';
import { useState, useEffect, useRef } from 'react';

const Timer = ({ seconds = 600, onTimeUp }) => {
  // Ensure seconds is a valid, positive number, otherwise default to 600
  const initialSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 600;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef();

  useEffect(() => {
    // Reset the timer if the initialSeconds prop changes (e.g., for a new question)
    setTimeLeft(initialSeconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, [initialSeconds, onTimeUp]);

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 60;

  return (
    <div className={`font-bold text-lg p-2 rounded-md ${isLowTime ? 'text-destructive animate-pulse' : 'text-primary'}`}>
      Time Left: {formatTime()}
    </div>
  );
};

export default Timer;
