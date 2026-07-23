import React, { useState } from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useThemeStore } from '../../store/appStore';
import ActionButtons from './ActionButtons';

export default function MobilePanel({ onClose }) {
    const { shoe, selectedMaterial, setMaterial, selectedSole, setSole, colorZones, setZoneColor,
            applyTemplate, selectedTemplate, accessories, toggleAccessory,
            selectedSize, setSize, designName, setDesignName } = useConfiguratorStore();
    const darkMode = useThemeStore(s => s.darkMode);
    const [tab, setTab] = useState('colors');

    const bg = darkMode ? 'bg-[#141414]' : 'bg-white';
    const inp = `w-full px-3 py-2 text-sm border focus:outline-none focus:border-[#E85D26] ${darkMode ? 'bg-[#222] border-[#333] text-white' : 'bg-white border-[#E5E5E5] text-[#111]'}`;
    const zones = ["Toe", "Sole", "Tongue", "Heel", "Laces"];

    return (
        <div className={`${bg} border-t overflow-y-auto max-h-[50vh] custom-scrollbar`} style={{ borderColor: 'var(--color-border)' }}>
            {/* Tab bar */}
            <div className="flex border-b sticky top-0 z-10" style={{ backgroundColor: 'var(--color-panel)', borderColor: 'var(--color-border)' }}>
                {['colors', 'material', 'extras', 'save'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                            className={`flex-1 py-3 text-[10px] tracking-widest uppercase ${tab === t ? 'text-[#E85D26] border-b-2 border-[#E85D26]' : ''}`}
                            style={tab !== t ? { color: 'var(--color-text-muted)' } : {}}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="p-5">
                {tab === 'colors' && (
                    <div className="space-y-3">
                        {zones.map(z => (
                            <div key={z} className="flex items-center justify-between">
                                <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text)' }}>{z}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{colorZones[z]}</span>
                                    <div className="relative w-8 h-8 rounded-full border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                                        <input type="color" value={colorZones[z]} onChange={e => setZoneColor(z, e.target.value)}
                                               className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {tab === 'material' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            {shoe?.available_materials?.map(m => (
                                <button key={m.id} onClick={() => setMaterial(m.id)}
                                        className={`p-3 text-xs tracking-wider uppercase border text-center ${selectedMaterial === m.id ? 'bg-[#111] text-white border-[#111]' : ''}`}
                                        style={selectedMaterial !== m.id ? { borderColor: 'var(--color-border)', color: 'var(--color-text)' } : {}}>
                                    {m.label?.split(' ')[0]}<br/>{m.price > 0 ? `+$${m.price}` : 'Free'}
                                </button>
                            ))}
                        </div>
                        <h4 className="text-[10px] tracking-widest text-[#E85D26] uppercase mt-4">Sole</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {shoe?.available_soles?.map(s => (
                                <button key={s.id} onClick={() => setSole(s.id)}
                                        className={`p-2 text-xs tracking-wider uppercase border ${selectedSole === s.id ? 'bg-[#111] text-white border-[#111]' : ''}`}
                                        style={selectedSole !== s.id ? { borderColor: 'var(--color-border)', color: 'var(--color-text)' } : {}}>
                                    {s.id} {s.price > 0 ? `+$${s.price}` : ''}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {tab === 'extras' && (
                    <div className="space-y-4">
                        <input type="text" value={designName} onChange={e => setDesignName(e.target.value)} placeholder="Design Name" className={inp} />

                        {[
                            { key: 'logo', label: 'Logo +$5' },
                            { key: 'ankleStrap', label: 'Strap +$10' },
                            { key: 'reflectiveStrip', label: 'Reflective +$8' },
                            { key: 'speedLaces', label: 'Speed Laces +$7' },
                        ].map(a => (
                            <label key={a.key} className="flex items-center justify-between">
                                <span className="text-xs tracking-wider" style={{ color: 'var(--color-text)' }}>{a.label}</span>
                                <input type="checkbox" checked={accessories[a.key]} onChange={() => toggleAccessory(a.key)} className="accent-[#E85D26]" />
                            </label>
                        ))}
                    </div>
                )}
                {tab === 'save' && <ActionButtons />}
            </div>
        </div>
    );
}
