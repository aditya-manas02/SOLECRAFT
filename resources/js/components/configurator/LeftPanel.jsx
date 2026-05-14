import React, { useState } from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useThemeStore } from '../../store/appStore';
import MaterialCard from '../ui/MaterialCard';
import TemplateCard from '../ui/TemplateCard';

function Accordion({ title, num, defaultOpen = false, children }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="mb-2">
            <button onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between py-3 text-xs tracking-widest text-[#E85D26] uppercase font-mono"
                    aria-expanded={open}>
                <span>{num} // {title}</span>
                <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>
            <div className={`accordion-content ${open ? 'open' : ''}`}>{children}</div>
        </div>
    );
}

export default function LeftPanel() {
    const { shoe, selectedMaterial, setMaterial, selectedSole, setSole, applyTemplate, selectedTemplate, calculateTotal,
            accessories, toggleAccessory, selectedSize, setSize } = useConfiguratorStore();
    const darkMode = useThemeStore(s => s.darkMode);

    if (!shoe) return null;

    const sizes = [
        { us: '6', eu: '38.5', uk: '5.5' }, { us: '7', eu: '40', uk: '6' },
        { us: '8', eu: '41', uk: '7' }, { us: '9', eu: '42', uk: '8' },
        { us: '10', eu: '43', uk: '9' }, { us: '11', eu: '44.5', uk: '10' },
        { us: '12', eu: '46', uk: '11' }, { us: '13', eu: '47.5', uk: '12' },
    ];

    const templates = ["Electric Sunrise", "Midnight Shadow", "Arctic White", "Solar Flare", "Forest Run", "Urban Smoke", "Ocean Depths", "Neon Cyber"];

    const panelBg = darkMode ? 'bg-[#141414] border-[#222]' : 'bg-white border-[#E5E5E5]';

    return (
        <div className={`h-full overflow-y-auto border-r p-5 font-mono custom-scrollbar ${panelBg}`}>
            {/* Material Selector */}
            <Accordion title="Material" num="01" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-2 pb-4">
                    {shoe.available_materials?.map(mat => (
                        <MaterialCard key={mat.id} material={mat} isSelected={selectedMaterial === mat.id}
                                      onClick={() => setMaterial(mat.id)} />
                    ))}
                </div>
            </Accordion>

            {/* Sole Options */}
            <Accordion title="Sole Type" num="02" defaultOpen={true}>
                <div className="grid grid-cols-1 gap-2 pb-4">
                    {shoe.available_soles?.map(sole => (
                        <button key={sole.id} onClick={() => setSole(sole.id)}
                                className={`p-3 text-left text-xs tracking-widest uppercase border transition-all ${
                                    selectedSole === sole.id
                                        ? 'bg-[#111] text-white border-[#111] dark:bg-[#E85D26] dark:border-[#E85D26]'
                                        : `hover:border-[#999] ${darkMode ? 'border-[#333] text-[#ccc]' : 'border-[#E5E5E5] text-[#111]'}`
                                }`}>
                            <div className="flex justify-between items-center">
                                <span>{sole.label || sole.id}</span>
                                {sole.price > 0 && <span className="text-[#E85D26]">+${sole.price}</span>}
                            </div>
                        </button>
                    ))}
                </div>
            </Accordion>

            {/* Size Selector */}
            <Accordion title="Size" num="03">
                <div className="grid grid-cols-4 gap-2 pb-4">
                    {sizes.map(s => (
                        <button key={s.us} onClick={() => setSize(s.us)}
                                className={`p-2 text-center text-xs border transition-colors ${
                                    selectedSize === s.us
                                        ? 'bg-[#111] text-white border-[#111] dark:bg-[#E85D26] dark:border-[#E85D26]'
                                        : `${darkMode ? 'border-[#333] text-[#999]' : 'border-[#E5E5E5]'} hover:border-[#E85D26]`
                                }`}>
                            <div className="font-bold">{s.us}</div>
                            <div className="text-[8px] tracking-wider" style={{ color: 'var(--color-text-muted)' }}>EU {s.eu}</div>
                        </button>
                    ))}
                </div>
            </Accordion>

            {/* Accessories */}
            <Accordion title="Accessories" num="04">
                <div className="space-y-3 pb-4">
                    {[
                        { key: 'logo', label: 'Logo Patch', icon: '🏷️', price: 5 },
                        { key: 'ankleStrap', label: 'Ankle Strap', icon: '🔗', price: 10 },
                        { key: 'reflectiveStrip', label: 'Reflective Strip', icon: '✨', price: 8 },
                        { key: 'speedLaces', label: 'Speed Laces', icon: '⚡', price: 7 },
                    ].map(acc => (
                        <label key={acc.key} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{acc.icon}</span>
                                <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--color-text)' }}>{acc.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#E85D26]">+${acc.price}</span>
                                <input type="checkbox" checked={accessories[acc.key]} onChange={() => toggleAccessory(acc.key)}
                                       className="w-4 h-4 accent-[#E85D26]" />
                            </div>
                        </label>
                    ))}
                </div>
            </Accordion>

            {/* Design Templates */}
            <Accordion title="Templates" num="05">
                <div className="flex flex-col gap-2 pb-4">
                    {templates.map(name => (
                        <TemplateCard key={name} name={name} isSelected={selectedTemplate === name}
                                      onClick={() => applyTemplate(name)} />
                    ))}
                </div>
            </Accordion>
        </div>
    );
}
