import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="text-center animate-fade-in">
                <div className="text-[120px] md:text-[180px] font-bold font-mono leading-none" style={{ color: 'var(--color-border)' }}>404</div>
                <div className="text-6xl mb-6 animate-float">👟</div>
                <h1 className="text-xl font-bold tracking-[0.2em] uppercase font-mono mb-3" style={{ color: 'var(--color-text)' }}>
                    Sole Not Found
                </h1>
                <p className="text-sm tracking-wider mb-10 max-w-sm mx-auto" style={{ color: 'var(--color-text-muted)' }}>
                    Looks like this sneaker walked away. Let's get you back on track.
                </p>
                <Link to="/" className="px-10 py-4 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase font-mono hover:bg-[#D14F1E] transition-colors hover:shadow-[0_0_30px_rgba(232,93,38,0.3)]">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
