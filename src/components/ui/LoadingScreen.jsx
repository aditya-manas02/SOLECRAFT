import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center" 
             style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="relative">
                <div className="w-16 h-16 border-2 border-[#E5E5E5] border-t-[#E85D26] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#E85D26] rounded-full animate-pulse opacity-60" />
                </div>
            </div>
            <div className="mt-6 text-[10px] tracking-[0.5em] uppercase font-mono" 
                 style={{ color: 'var(--color-text-muted)' }}>
                Loading
            </div>
        </div>
    );
}
