import React, { useCallback } from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useToastStore, useThemeStore } from '../../store/appStore';

export default function ToolbarOverlay() {
    const { undo, redo, randomize, setCameraView, cameraView, canUndo, canRedo } = useConfiguratorStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);

    const handleScreenshot = useCallback(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) { addToast('Canvas not found', 'error'); return; }
        try {
            const link = document.createElement('a');
            link.download = `solecraft-design-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            addToast('Screenshot saved!', 'success');
        } catch { addToast('Screenshot failed', 'error'); }
    }, []);

    const btnCls = `w-9 h-9 flex items-center justify-center rounded transition-all duration-200 text-sm ${
        darkMode ? 'bg-[#222] text-white hover:bg-[#333] border border-[#333]' : 'bg-white text-[#111] hover:bg-gray-100 border border-[#E5E5E5] shadow-sm'
    }`;
    const btnDisabled = 'opacity-30 cursor-not-allowed';

    const views = [
        { id: 'front', label: 'F' },
        { id: 'side', label: 'S' },
        { id: 'top', label: 'T' },
        { id: 'heel', label: 'H' },
    ];

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {/* Undo */}
            <button onClick={undo} className={`${btnCls} ${!canUndo() ? btnDisabled : ''}`}
                    disabled={!canUndo()} title="Undo (Ctrl+Z)" aria-label="Undo">↩</button>
            {/* Redo */}
            <button onClick={redo} className={`${btnCls} ${!canRedo() ? btnDisabled : ''}`}
                    disabled={!canRedo()} title="Redo (Ctrl+Y)" aria-label="Redo">↪</button>

            <div className="h-px my-1" style={{ backgroundColor: 'var(--color-border)' }} />

            {/* Randomize */}
            <button onClick={() => { randomize(); addToast('Surprise! 🎲', 'info'); }}
                    className={btnCls} title="Randomize colors" aria-label="Randomize">🎲</button>
            {/* Screenshot */}
            <button onClick={handleScreenshot} className={btnCls} title="Take screenshot" aria-label="Screenshot">📸</button>

            <div className="h-px my-1" style={{ backgroundColor: 'var(--color-border)' }} />

            {/* Camera views */}
            {views.map(v => (
                <button key={v.id} onClick={() => setCameraView(v.id)}
                        className={`${btnCls} text-[10px] font-bold tracking-wider ${cameraView === v.id ? 'ring-2 ring-[#E85D26]' : ''}`}
                        title={`${v.id} view`} aria-label={`${v.id} camera view`}>
                    {v.label}
                </button>
            ))}
        </div>
    );
}
