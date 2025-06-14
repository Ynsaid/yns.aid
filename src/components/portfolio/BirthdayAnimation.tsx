'use client';

import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const BirthdayAnimation = () => {
  const [showConfetti, setShowConfetti] = useState(true); // Force show confetti
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // Auto-hide after 8 seconds
    setTimeout(() => setShowConfetti(false), 8000);
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          recycle={false}
        />
      )}
      {showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-600 px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 Happy Birthday Younes! 🎂
          </h1>
        </div>
      )}
    </>
  );
};

export default BirthdayAnimation;
