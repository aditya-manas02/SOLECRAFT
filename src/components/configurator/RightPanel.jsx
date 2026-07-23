"use client";

import React from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';
import ActionButtons from './ActionButtons';

export default function RightPanel({ activeStep, setActiveStep }) {
    const { 
        shoe, colorZones, setZoneColor, selectedMaterial, setMaterial, 
        selectedSole, setSole, designName, setDesignName, totalPrice, 
        accessories, toggleAccessory 
    } = useConfiguratorStore();

    if (!shoe) return null;

    // Define colors for each step
    const leatherColors = [
        { name: "OFF-WHITE", hex: "#EAE6E1" },
        { name: "BLACK", hex: "#1C1C1C" },
        { name: "TAN", hex: "#B07D53" },
        { name: "NAVY", hex: "#2B3B4C" }
    ];

    const suedeColors = [
        { name: "TAUPE", hex: "#A59D96" },
        { name: "FOREST", hex: "#3E5346" },
        { name: "BLUSH", hex: "#D5B5AD" }
    ];

    const meshColors = [
        { name: "CHERRY", hex: "#A53535" },
        { name: "ROYAL", hex: "#2B4CA5" },
        { name: "GRAVEL", hex: "#8E8E8E" }
    ];

    const lacesColors = [
        { name: "OFF-WHITE", hex: "#FFFFFF" },
        { name: "CHARCOAL", hex: "#333333" },
        { name: "TAN", hex: "#B07D53" },
        { name: "FOREST", hex: "#3E5346" }
    ];

    const soleColors = [
        { name: "OFF-WHITE", hex: "#EAE6E1" },
        { name: "BLACK", hex: "#1C1C1C" },
        { name: "GUM", hex: "#C39C75" }
    ];

    const getColorsForMaterial = () => {
        if (selectedMaterial === 'leather') return leatherColors;
        if (selectedMaterial === 'suede') return suedeColors;
        return meshColors;
    };

    const [activeSubZone, setActiveSubZone] = React.useState("all"); // all | toe | tongue | heel

    const handleUpperColor = (hex) => {
        if (activeSubZone === "all") {
            setZoneColor("Toe", hex);
            setZoneColor("Tongue", hex);
            setZoneColor("Heel", hex);
        } else if (activeSubZone === "toe") {
            setZoneColor("Toe", hex);
        } else if (activeSubZone === "tongue") {
            setZoneColor("Tongue", hex);
        } else if (activeSubZone === "heel") {
            setZoneColor("Heel", hex);
        }
    };

    // Descriptions
    const descriptions = {
        leather: "Material Full-grain. Premium grade leather that ages beautifully, featuring a raw grain and structured texture.",
        suede: "Premium Suede. Velvety touch, deep coloration, and flexible fit for ultimate luxury feel.",
        mesh: "Technical Knit Mesh. Highly breathable lightweight structure ideal for casual everyday wear."
    };

    const activeColor = colorZones.Toe; // Representation color for upper

    return (
        <div className="h-full bg-[#F5F3EF] p-8 flex flex-col justify-between overflow-y-auto select-none font-mono">
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-[#E8E6DF] pb-4">
                    <span className="text-[10px] tracking-[0.4em] font-bold text-[#888]">A LA CARTE</span>
                    {activeStep < 5 && (
                        <button 
                            onClick={() => setActiveStep(activeStep + 1)}
                            className="px-5 py-2 bg-[#111] text-white text-[10px] tracking-[0.2em] font-bold uppercase rounded-full hover:bg-[#E85D26] transition-colors cursor-pointer"
                        >
                            Next Step
                        </button>
                    )}
                </div>

                {/* Step 1: UPPER */}
                {activeStep === 1 && (
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-3 uppercase">Upper Material</span>
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'leather', label: 'Full-Grain Leather' },
                                    { id: 'suede', label: 'Premium Suede' },
                                    { id: 'mesh', label: 'Mesh' }
                                ].map(mat => (
                                    <button
                                        key={mat.id}
                                        onClick={() => setMaterial(mat.id)}
                                        className={`w-full py-3.5 text-xs font-bold tracking-widest uppercase border transition-all text-left px-5 rounded ${
                                            selectedMaterial === mat.id
                                                ? 'border-[#111] bg-[#EAE6E1] text-[#111]'
                                                : 'border-[#E0DED7] bg-white text-[#888] hover:border-[#aaa]'
                                        }`}
                                    >
                                        {mat.label}
                                        {selectedMaterial === mat.id && <span className="float-right text-[10px] text-[#E85D26]">Selected</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-3 uppercase">Customize Zone</span>
                            <div className="flex flex-wrap gap-1.5 mb-4 border-b border-[#E8E6DF] pb-3">
                                {[
                                    { id: 'all', label: 'All Upper' },
                                    { id: 'toe', label: 'Toe' },
                                    { id: 'tongue', label: 'Tongue' },
                                    { id: 'heel', label: 'Heel' }
                                ].map(z => (
                                    <button
                                        key={z.id}
                                        onClick={() => setActiveSubZone(z.id)}
                                        className={`px-3 py-1.5 text-[8px] tracking-widest uppercase font-bold border rounded transition-all cursor-pointer ${
                                            activeSubZone === z.id
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white border-[#E0DED7] text-[#888] hover:border-[#aaa]'
                                        }`}
                                    >
                                        {z.label}
                                    </button>
                                ))}
                            </div>

                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-4 uppercase">Color Selector</span>
                            <div className="flex gap-4 items-center">
                                {getColorsForMaterial().map(c => {
                                    const isSelected = 
                                        activeSubZone === 'all' ? (colorZones.Toe === c.hex && colorZones.Tongue === c.hex && colorZones.Heel === c.hex) :
                                        activeSubZone === 'toe' ? (colorZones.Toe === c.hex) :
                                        activeSubZone === 'tongue' ? (colorZones.Tongue === c.hex) :
                                        (colorZones.Heel === c.hex);

                                    return (
                                        <button
                                            key={c.name}
                                            onClick={() => handleUpperColor(c.hex)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                                                isSelected 
                                                    ? 'border-[#111] scale-110 shadow-md' 
                                                    : 'border-transparent hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.name}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-[10px] text-[#666] tracking-wider block mt-3 uppercase">
                                Active: {
                                    activeSubZone === 'all' ? (colorZones.Toe === colorZones.Tongue && colorZones.Toe === colorZones.Heel ? (getColorsForMaterial().find(c => c.hex === colorZones.Toe)?.name || "Mixed") : "Mixed") :
                                    activeSubZone === 'toe' ? (getColorsForMaterial().find(c => c.hex === colorZones.Toe)?.name || "Custom") :
                                    activeSubZone === 'tongue' ? (getColorsForMaterial().find(c => c.hex === colorZones.Tongue)?.name || "Custom") :
                                    (getColorsForMaterial().find(c => c.hex === colorZones.Heel)?.name || "Custom")
                                }
                            </span>
                        </div>

                        <div className="border-t border-[#E8E6DF] pt-6">
                            <p className="text-[11px] leading-relaxed text-[#666] tracking-wide">
                                {descriptions[selectedMaterial]}
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: LACES */}
                {activeStep === 2 && (
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-3 uppercase">Lacing System</span>
                            <label className="flex items-center justify-between cursor-pointer group bg-white border border-[#E0DED7] p-4 rounded">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold tracking-wider uppercase text-[#111]">Speed Lacing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={accessories.speedLaces} onChange={() => toggleAccessory('speedLaces')}
                                           className="w-4 h-4 accent-[#E85D26]" />
                                </div>
                            </label>
                        </div>

                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-4 uppercase">Laces Color</span>
                            <div className="flex gap-4 items-center">
                                {lacesColors.map(c => (
                                    <button
                                        key={c.name}
                                        onClick={() => setZoneColor("Laces", c.hex)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                                            colorZones.Laces === c.hex 
                                                ? 'border-[#111] scale-110 shadow-md' 
                                                : 'border-transparent hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: c.hex }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] text-[#666] tracking-wider block mt-3 uppercase">
                                Active: {lacesColors.find(c => c.hex === colorZones.Laces)?.name || "Custom"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Step 3: SOLE */}
                {activeStep === 3 && (
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-3 uppercase">Sole Platform</span>
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'flat', label: 'Classic Flat' },
                                    { id: 'platform', label: 'Elevated Platform' },
                                    { id: 'trail', label: 'Rugged Trail' }
                                ].map(sole => (
                                    <button
                                        key={sole.id}
                                        onClick={() => setSole(sole.id)}
                                        className={`w-full py-3.5 text-xs font-bold tracking-widest uppercase border transition-all text-left px-5 rounded ${
                                            selectedSole === sole.id
                                                ? 'border-[#111] bg-[#EAE6E1] text-[#111]'
                                                : 'border-[#E0DED7] bg-white text-[#888] hover:border-[#aaa]'
                                        }`}
                                    >
                                        {sole.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-4 uppercase">Sole Color</span>
                            <div className="flex gap-4 items-center">
                                {soleColors.map(c => (
                                    <button
                                        key={c.name}
                                        onClick={() => setZoneColor("Sole", c.hex)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                                            colorZones.Sole === c.hex 
                                                ? 'border-[#111] scale-110 shadow-md' 
                                                : 'border-transparent hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: c.hex }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: HARDWARE */}
                {activeStep === 4 && (
                    <div className="animate-fade-in space-y-6">
                        <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-4 uppercase">Custom Accessories</span>
                        {[
                            { key: 'logo', label: 'Logo Patch', price: 5 },
                            { key: 'ankleStrap', label: 'Ankle Strap', price: 10 },
                            { key: 'reflectiveStrip', label: 'Reflective Strip', price: 8 },
                        ].map(acc => (
                            <label key={acc.key} className="flex items-center justify-between cursor-pointer group bg-white border border-[#E0DED7] p-4 rounded">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold tracking-wider uppercase text-[#111]">{acc.label}</span>
                                    <span className="text-[9px] text-[#E85D26] mt-0.5">+${acc.price}</span>
                                </div>
                                <input type="checkbox" checked={accessories[acc.key]} onChange={() => toggleAccessory(acc.key)}
                                       className="w-4 h-4 accent-[#E85D26]" />
                            </label>
                        ))}
                    </div>
                )}

                {/* Step 5: MONOGRAM */}
                {activeStep === 5 && (
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-3 uppercase">Embroidery / Monogram Label</span>
                            <input 
                                type="text" 
                                value={designName} 
                                onChange={e => setDesignName(e.target.value)}
                                maxLength={15} 
                                placeholder="e.g. STUDIO 01"
                                className="w-full px-4 py-3 bg-white border border-[#E0DED7] text-xs font-bold tracking-wider uppercase focus:outline-none focus:border-[#111] rounded"
                            />
                        </div>

                        <div className="border-t border-[#E8E6DF] pt-6">
                            <span className="text-[10px] tracking-[0.2em] font-bold text-[#888] block mb-2 uppercase">Estimate Breakdown</span>
                            <div className="space-y-2 text-xs text-[#666]">
                                <div className="flex justify-between"><span>Base shoe</span><span>$120.00</span></div>
                                <div className="flex justify-between"><span>Custom materials</span><span>${(totalPrice - 120).toFixed(2)}</span></div>
                                <div className="flex justify-between border-t border-[#EAE6E1] pt-2 font-bold text-[#111]">
                                    <span>Total Price</span><span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Actions and Price */}
            <div className="border-t border-[#E8E6DF] pt-6 bg-inherit mt-8">
                <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[10px] tracking-[0.2em] font-bold text-[#888]">EST. PRICE</span>
                    <span className="text-2xl font-black text-[#111]">${totalPrice.toFixed(2)}</span>
                </div>
                <ActionButtons />
            </div>
        </div>
    );
}
