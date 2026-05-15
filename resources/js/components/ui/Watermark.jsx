import React, { useState, useEffect } from 'react';

/**
 * A subtle watermark component with a typing animation.
 * Visible in both light and dark modes.
 */
export default function Watermark() {
  const text = "Developer — Aditya Manas";
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(text.substring(0, displayText.length + 1));
        setSpeed(150);
        if (displayText === text) {
          setTimeout(() => setIsDeleting(true), 3000); // Pause at end
        }
      } else {
        setDisplayText(text.substring(0, displayText.length - 1));
        setSpeed(100);
        if (displayText === '') {
          setIsDeleting(false);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, speed]);

  return (
    <div 
      className="fixed bottom-4 left-4 z-[9999] pointer-events-none select-none flex items-center"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--color-text)',
        opacity: 0.4, // Increased opacity for better visibility
        textShadow: '0 1px 2px rgba(0,0,0,0.1)', // Subtle shadow for light mode
      }}
    >
      <span>{displayText}</span>
      <span className="w-[2px] h-[12px] bg-current ml-1 animate-pulse" />
    </div>
  );
}
