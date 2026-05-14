import React from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useThemeStore } from '../../store/appStore';
import ActionButtons from './ActionButtons';

export default function RightPanel() {
    const { colorZones, setZoneColor, designName, setDesignName, recentColors } = useConfiguratorStore();
    const darkMode = useThemeStore(s => s.darkMode);

    const zones = ["Toe", "Sole", "Tongue", "Heel", "Laces"];
    const panelBg = darkMode ? 'bg-[#141414] border-[#222]' : 'bg-white border-[#E5E5E5]';

    return (
        <div className={`h-full border-l font-mono flex flex-col min-h-0 ${panelBg}`}>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-5 custom-scrollbar">
                {/* Design Name */}
                <div className="mb-6">
                    <label className="text-xs tracking-widest text-[#E85D26] uppercase mb-3 block">Design Name</label>
                    <input type="text" value={designName} onChange={e => setDesignName(e.target.value)}
                           maxLength={50} placeholder="My Custom Sneaker"
                           className={`w-full px-3 py-2.5 text-sm tracking-wider border focus:outline-none focus:border-[#E85D26] ${
                               darkMode ? 'bg-[#222] border-[#333] text-white' : 'bg-white border-[#E5E5E5] text-[#111]'}`} />
                </div>

                {/* Color Zone Painter */}
                <div className="mb-6">
                    <h2 className="text-xs tracking-widest text-[#E85D26] mb-4 uppercase">Color Zones</h2>
                    <div className="flex flex-col gap-3">
                        {zones.map(zone => (
                            <div key={zone} className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: colorZones[zone], borderColor: 'var(--color-border)' }} />
                                    <span className="uppercase text-xs tracking-widest" style={{ color: 'var(--color-text)' }}>{zone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="text" value={colorZones[zone]} onChange={e => setZoneColor(zone, e.target.value)}
                                           className={`w-20 text-[10px] tracking-wider text-center border px-1 py-1 focus:outline-none focus:border-[#E85D26] uppercase ${
                                               darkMode ? 'bg-[#222] border-[#333] text-[#999]' : 'bg-[#FAFAFA] border-[#E5E5E5] text-[#666]'}`} />
                                    <div className="relative w-7 h-7 rounded-full border overflow-hidden cursor-pointer" style={{ borderColor: 'var(--color-border)' }}>
                                        <input type="color" value={colorZones[zone]} onChange={e => setZoneColor(zone, e.target.value)}
                                               className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-none p-0 bg-transparent" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Colors */}
                {recentColors.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-muted)' }}>Recent Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentColors.map((c, i) => (
                                <button key={i} className="w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c, borderColor: 'var(--color-border)' }}
                                        title={c} aria-label={`Apply color ${c}`}
                                        onClick={() => {/* user picks a zone then applies */}} />
                            ))}
                        </div>
                    </div>
                )}


            </div>

            {/* Sticky Action Buttons at the Bottom */}
            <div className="p-5 border-t bg-inherit z-10" style={{ borderColor: 'var(--color-border)' }}>
                <ActionButtons />
            </div>
        </div>
    );
}
