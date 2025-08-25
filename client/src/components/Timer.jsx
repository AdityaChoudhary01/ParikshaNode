// Timer.jsx - Timer component for quizzes
import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ minutes, onTimeUp }) => {
  const [seconds, setSeconds] = useState(minutes * 60);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current); // Cleanup on component unmount
  }, [onTimeUp]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = seconds <= 60; // Less than or equal to 1 minute

  return (
    <div className={`font-bold text-lg p-2 rounded-md ${isLowTime ? 'text-destructive animate-pulse' : 'text-primary'}`}>
      Time Left: {formatTime()}
    </div>
  );
};

export default Timer;