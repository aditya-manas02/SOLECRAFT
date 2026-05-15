import React from 'react';

/**
 * A subtle watermark component for the developer credit.
 * Fixed to the bottom left, low opacity to remain unobtrusive.
 */
export default function Watermark() {
  return (
    <div 
      className="fixed bottom-4 left-4 z-[9999] pointer-events-none select-none opacity-20"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--color-text)',
      }}
    >
      Developer — Aditya Manas
    </div>
  );
}
