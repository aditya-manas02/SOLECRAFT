import React, { useState, useEffect } from 'react';

/**
 * A watermark where 'Developer —' is static and the name has a typing animation.
 */
export default function Watermark() {
  const staticText = "Developer — ";
  const animatedText = "Aditya Manas";
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(animatedText.substring(0, displayText.length + 1));
        setSpeed(150);
        if (displayText === animatedText) {
          setTimeout(() => setIsDeleting(true), 4000); // Pause longer at the end
        }
      } else {
        setDisplayText(animatedText.substring(0, displayText.length - 1));
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
      className="fixed bottom-6 left-6 z-[9999] pointer-events-auto select-none flex items-center group cursor-default"
    >
      <div className="flex items-center px-3 py-1.5 rounded-full border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-lg shadow-black/5 opacity-60 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105">
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mr-2 animate-pulse" />
        <span 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.02em',
            color: 'var(--color-text)',
          }}
        >
          {staticText}
          <span className="text-[var(--color-accent)]">{displayText}</span>
        </span>
        <span className="w-[1.5px] h-[12px] bg-[var(--color-accent)] ml-1 animate-pulse" />
      </div>
    </div>
  );
}
