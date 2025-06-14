import React, { useEffect, useState } from 'react';

const MouseGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    >
      <div
        className="absolute w-60 h-60 bg-purple-500 opacity-30 rounded-full blur-3xl transition-transform duration-100"
        style={{
          transform: `translate(${position.x - 120}px, ${position.y - 120}px)`,
        }}
      ></div>
    </div>
  );
};

export default MouseGlow;
