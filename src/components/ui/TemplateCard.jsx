import React from 'react';
import { useThemeStore } from '../../store/appStore';

export default function TemplateCard({ name, isSelected, onClick }) {
    const darkMode = useThemeStore(s => s.darkMode);
    const templates = {
      "Electric Sunrise": ["#FF6B35", "#FFD166", "#EF476F", "#06D6A0", "#FFFFFF"],
      "Midnight Shadow":  ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"],
      "Arctic White":     ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD"],
      "Solar Flare":      ["#F72585", "#7209B7", "#3A0CA3", "#4CC9F0", "#FFFFFF"],
      "Forest Run":       ["#2D6A4F", "#1B4332", "#52B788", "#95D5B2", "#D8F3DC"],
      "Urban Smoke":      ["#4A4E69", "#22223B", "#9A8C98", "#C9ADA7", "#F2E9E4"],
      "Ocean Depths":     ["#023E8A", "#0077B6", "#0096C7", "#00B4D8", "#90E0EF"],
      "Neon Cyber":       ["#0D0D0D", "#39FF14", "#FF073A", "#00F0FF", "#FFFFFF"],
    };
    const colors = templates[name] || ["#000", "#333", "#666", "#999", "#CCC"];

    return (
        <button onClick={onClick} aria-label={`Apply ${name} template`}
            className={`p-3 border transition-all flex items-center justify-between text-left ${
                isSelected
                    ? 'ring-2 ring-[#E85D26] border-transparent'
                    : `hover:border-[#E85D26] ${darkMode ? 'border-[#333] bg-[#1A1A1A]' : 'border-[#E5E5E5] bg-white'}`
            }`}>
            <span className="text-[10px] uppercase tracking-widest font-bold truncate" style={{ color: 'var(--color-text)' }}>{name}</span>
            <div className="flex -space-x-1 shrink-0 ml-2">
                {colors.map((color, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color, borderColor: darkMode ? '#333' : '#E5E5E5' }} />
                ))}
            </div>
        </button>
    );
}
