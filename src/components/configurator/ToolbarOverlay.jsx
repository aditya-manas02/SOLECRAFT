"use client";

import React from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { useToastStore } from '@/store/appStore';

export default function ToolbarOverlay() {
    const { undo, redo, randomize, canUndo, canRedo } = useConfiguratorStore();
    const addToast = useToastStore(s => s.addToast);

    return (
        <div className="absolute top-6 right-6 z-20 flex gap-2 select-none font-mono">
            {/* Undo */}
            <button 
                onClick={undo} 
                disabled={!canUndo()} 
                className={`w-9 h-9 rounded-full bg-white border border-[#E0DED7] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform ${
                    !canUndo() ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title="Undo (Ctrl+Z)"
            >
                <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
            </button>

            {/* Redo */}
            <button 
                onClick={redo} 
                disabled={!canRedo()} 
                className={`w-9 h-9 rounded-full bg-white border border-[#E0DED7] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform ${
                    !canRedo() ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title="Redo (Ctrl+Y)"
            >
                <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                </svg>
            </button>

            {/* Randomize */}
            <button 
                onClick={() => { randomize(); addToast('Surprise! 🎲', 'info'); }}
                className="w-9 h-9 rounded-full bg-white border border-[#E0DED7] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title="Shuffle Colors"
            >
                <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3m0 0l3-3m-3 3V8" />
                </svg>
            </button>
        </div>
    );
}
