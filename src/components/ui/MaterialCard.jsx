import React from 'react';
import { useThemeStore } from '../../store/appStore';

export default function MaterialCard({ material, isSelected, onClick }) {
    const darkMode = useThemeStore(s => s.darkMode);
    return (
        <button onClick={onClick} aria-label={`Select ${material.label}`}
            className={`p-3 border text-center transition-all flex flex-col items-center justify-center h-[90px] ${
                isSelected 
                    ? 'border-2 border-[#E85D26] bg-[#E85D26]/10 text-[#E85D26]' 
                    : `hover:border-[#E85D26] ${darkMode ? 'border-[#333] text-[#ccc] bg-[#1A1A1A]' : 'border-[#E5E5E5] bg-white text-[#111]'}`
            }`}>
            <span className="text-[10px] uppercase tracking-widest font-bold leading-tight mb-1">{material.label?.split(' ')[0]}</span>
            <span className="text-[9px] tracking-wider" style={{ color: isSelected ? '#E85D26' : 'var(--color-text-muted)' }}>
                {material.price > 0 ? `+$${material.price}` : 'Included'}
            </span>
        </button>
    );
}
