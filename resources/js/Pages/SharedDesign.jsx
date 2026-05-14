import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CenterCanvas } from '../components/configurator/CenterCanvas';
import { useConfiguratorStore } from '../store/configuratorStore';
import { useThemeStore } from '../store/appStore';

export default function SharedDesign() {
    const { token } = useParams();
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setShoe, loadConfig } = useConfiguratorStore();
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        axios.get(`/api/designs/shared/${token}`)
            .then(res => {
                const d = res.data.data;
                setDesign(d);
                if (d.shoe) setShoe(d.shoe);
                loadConfig(d);
                setLoading(false);
            })
            .catch(() => { setError('Design not found'); setLoading(false); });
    }, [token]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="w-10 h-10 border-2 border-[#E85D26] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="text-center">
                <div className="text-4xl mb-4">😕</div>
                <p className="text-sm tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>{error}</p>
                <Link to="/" className="px-8 py-3 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase">Go Home</Link>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col pt-16" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Info bar */}
            <div className="px-6 py-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                    <span className="text-[10px] tracking-[0.3em] text-[#E85D26] uppercase">Shared Design</span>
                    <h2 className="font-bold tracking-wider font-mono" style={{ color: 'var(--color-text)' }}>
                        {design?.design_name || 'Custom Design'}
                    </h2>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                        ${parseFloat(design?.total_price || 0).toFixed(2)}
                    </div>
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        {design?.material} · {design?.sole_type}
                    </span>
                </div>
            </div>
            {/* 3D viewer (read-only) */}
            <div className="flex-1 relative">
                <CenterCanvas />
                <div className="absolute bottom-6 left-6 px-4 py-2 text-[10px] tracking-widest uppercase font-mono glass text-white rounded">
                    Read-only preview · Rotate to explore
                </div>
            </div>
        </div>
    );
}
