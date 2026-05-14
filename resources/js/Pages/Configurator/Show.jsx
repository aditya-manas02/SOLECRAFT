import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useToastStore, useThemeStore } from '../../store/appStore';
import LeftPanel from '../../components/configurator/LeftPanel';
import RightPanel from '../../components/configurator/RightPanel';
import { CenterCanvas } from '../../components/configurator/CenterCanvas';
import PriceOverlay from '../../components/configurator/PriceOverlay';
import ToolbarOverlay from '../../components/configurator/ToolbarOverlay';
import MobilePanel from '../../components/configurator/MobilePanel';

export default function Show() {
    const { id } = useParams();
    const { setShoe, setLoading, setError, calculateTotal, isLoading, error, undo, redo } = useConfiguratorStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);
    const [mobilePanel, setMobilePanel] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/shoes/${id}`)
            .then(res => { setShoe(res.data.data); calculateTotal(); })
            .catch(err => { setError('Failed to load shoe model.'); addToast('Failed to load', 'error'); })
            .finally(() => setLoading(false));
    }, [id]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-t-[#E85D26] rounded-full animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: '#E85D26' }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-mono" style={{ color: 'var(--color-text-muted)' }}>Loading configurator</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="text-center p-8">
                <div className="text-4xl mb-4">😕</div>
                <p className="text-red-500 font-mono text-sm tracking-wider">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="h-screen overflow-hidden flex flex-col pt-16">
            {/* Desktop layout */}
            <div className="flex-1 min-h-0 hidden md:grid configurator-grid" style={{ gridTemplateColumns: '300px 1fr 300px' }}>
                <div className="configurator-left-panel min-h-0 h-full"><LeftPanel /></div>
                <div className="relative h-full w-full min-h-0" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <CenterCanvas />
                    <PriceOverlay />
                    <ToolbarOverlay />
                </div>
                <div className="configurator-right-panel min-h-0 h-full"><RightPanel /></div>
            </div>

            {/* Mobile layout */}
            <div className="flex-1 md:hidden flex flex-col">
                <div className="flex-1 relative" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <CenterCanvas />
                    <PriceOverlay />
                    {/* Mobile toggle button */}
                    <button onClick={() => setMobilePanel(!mobilePanel)}
                            className="absolute bottom-4 right-4 z-20 px-5 py-3 bg-[#E85D26] text-white text-xs tracking-widest uppercase font-mono shadow-lg"
                            aria-label="Toggle customization panel">
                        {mobilePanel ? 'Close' : '⚙ Customize'}
                    </button>
                </div>
                {mobilePanel && <MobilePanel onClose={() => setMobilePanel(false)} />}
            </div>
        </div>
    );
}
