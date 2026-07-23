"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { useToastStore, useThemeStore } from '@/store/appStore';
import LeftPanel from '@/components/configurator/LeftPanel';
import RightPanel from '@/components/configurator/RightPanel';
import { CenterCanvas } from '@/components/configurator/CenterCanvas';
import ToolbarOverlay from '@/components/configurator/ToolbarOverlay';

export default function Show() {
    const { id } = useParams();
    const { 
        setShoe, setLoading, setError, calculateTotal, isLoading, error, undo, redo,
        colorZones, setZoneColor, selectedMaterial, setMaterial, designName, setDesignName 
    } = useConfiguratorStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);

    const [activeStep, setActiveStep] = useState(1); // 1: Upper, 2: Laces, 3: Sole, 4: Hardware, 5: Monogram
    const [activePreset, setActivePreset] = useState(0); // 0: Off-White, 1: Black, 2: Tan, 3: Forest, 4: Blush

    const presets = [
        {
            name: "Off-White",
            material: "leather",
            colors: { Toe: "#EAE6E1", Sole: "#EAE6E1", Tongue: "#EAE6E1", Heel: "#EAE6E1", Laces: "#FFFFFF" }
        },
        {
            name: "All Black",
            material: "leather",
            colors: { Toe: "#1C1C1C", Sole: "#1C1C1C", Tongue: "#1C1C1C", Heel: "#1C1C1C", Laces: "#1C1C1C" }
        },
        {
            name: "Tan Desert",
            material: "leather",
            colors: { Toe: "#B07D53", Sole: "#FFFFFF", Tongue: "#B07D53", Heel: "#B07D53", Laces: "#EAE6E1" }
        },
        {
            name: "Forest Run",
            material: "suede",
            colors: { Toe: "#3E5346", Sole: "#FFFFFF", Tongue: "#3E5346", Heel: "#3E5346", Laces: "#3E5346" }
        },
        {
            name: "Blush Pink",
            material: "suede",
            colors: { Toe: "#D5B5AD", Sole: "#FFFFFF", Tongue: "#D5B5AD", Heel: "#D5B5AD", Laces: "#EAE6E1" }
        }
    ];

    const applyPreset = (index) => {
        setActivePreset(index);
        const preset = presets[index];
        setMaterial(preset.material);
        Object.entries(preset.colors).forEach(([zone, color]) => {
            setZoneColor(zone, color);
        });
        addToast(`Applied preset: ${preset.name}`, 'info');
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`/api/shoes/${id}`)
            .then(res => { 
                setShoe(res.data.data); 
                calculateTotal();
                // Apply default off-white preset initially
                setMaterial("leather");
                Object.entries(presets[0].colors).forEach(([zone, color]) => {
                    setZoneColor(zone, color);
                });
            })
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
        <div className="h-screen flex items-center justify-center animate-fade-in bg-[#F5F3EF]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-t-[#E85D26] rounded-full animate-spin" style={{ borderColor: '#E5E5E5', borderTopColor: '#E85D26' }} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#999]">Loading configurator</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center animate-fade-in bg-[#F5F3EF]">
            <div className="text-center p-8">
                <div className="text-4xl mb-4">😕</div>
                <p className="text-red-500 font-mono text-sm tracking-wider">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-[#F2F1EC] text-[#111] font-mono animate-fade-in">
            
            {/* Main Configurator Workspace */}
            <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: '280px 1fr 340px' }}>
                
                {/* Left Panel: Step Selection checklist */}
                <div className="min-h-0 h-full border-r border-[#E0DED7]">
                    <LeftPanel activeStep={activeStep} setActiveStep={setActiveStep} />
                </div>

                {/* Center Panel: 3D Studio Canvas + floating swatches + slider */}
                <div className="relative h-full flex flex-col justify-between min-h-0 bg-[#F5F3EF]">
                    
                    {/* Header Info Area */}
                    <div className="absolute top-6 left-6 z-10 select-none">
                        <span className="text-[9px] tracking-[0.4em] text-[#888] uppercase block mb-1">STUDIO SNEAKER</span>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-[#111]">
                            {designName.toUpperCase()}: 01
                        </h2>
                        <span className="text-[10px] tracking-wider text-[#666] block mt-1">Model: 01</span>
                    </div>

                    {/* Floating Controls & Undo/Redo (Top Right) */}
                    <ToolbarOverlay />

                    {/* Canvas Area */}
                    <div className="flex-1 relative min-h-0">
                        <CenterCanvas activeStep={activeStep} />
                    </div>

                    {/* Bottom Presets Thumbnail Slider */}
                    <div className="px-8 pb-6 border-t border-[#E8E6DF] bg-[#F5F3EF]/90 backdrop-blur-sm pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] tracking-[0.3em] font-bold text-[#888] uppercase">Presets / Designs</span>
                            <div className="flex gap-2">
                                <button className="w-5 h-5 rounded-full border border-[#D5D3CB] flex items-center justify-center hover:bg-white text-[10px]">&lt;</button>
                                <button className="w-5 h-5 rounded-full border border-[#D5D3CB] flex items-center justify-center hover:bg-white text-[10px]">&gt;</button>
                            </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
                            {presets.map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => applyPreset(idx)}
                                    className={`flex-shrink-0 w-36 p-3 bg-white border rounded text-left transition-all ${
                                        activePreset === idx 
                                            ? 'border-[#111] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-[#111]' 
                                            : 'border-[#E0DED7] hover:border-[#aaa]'
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 mb-2">
                                        {Object.values(preset.colors).map((color, cIdx) => (
                                            <div key={cIdx} className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider block text-[#111]">{preset.name}</span>
                                    <span className="text-[8px] tracking-widest uppercase text-[#888] block mt-0.5">{preset.material}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Step Detail Controls */}
                <div className="min-h-0 h-full border-l border-[#E0DED7]">
                    <RightPanel activeStep={activeStep} setActiveStep={setActiveStep} />
                </div>

            </div>
        </div>
    );
}
