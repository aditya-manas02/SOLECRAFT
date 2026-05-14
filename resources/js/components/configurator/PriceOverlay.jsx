import React from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useThemeStore } from '../../store/appStore';

export default function PriceOverlay() {
    const { totalPrice, shoe, selectedMaterial, selectedSole, accessories } = useConfiguratorStore();
    const darkMode = useThemeStore(s => s.darkMode);

    const matPrice = shoe?.available_materials?.find(m => m.id === selectedMaterial)?.price || 0;
    const solePrice = shoe?.available_soles?.find(s => s.id === selectedSole)?.price || 0;
    let accPrice = 0;
    if (accessories?.logo) accPrice += 5;
    if (accessories?.ankleStrap) accPrice += 10;
    if (accessories?.reflectiveStrip) accPrice += 8;
    if (accessories?.speedLaces) accPrice += 7;


    return (
        <div className={`absolute bottom-6 left-6 p-5 min-w-[200px] group cursor-default z-10 ${
            darkMode ? 'bg-[#111]/90 backdrop-blur-md border border-[#333]' : 'bg-black/85 backdrop-blur-md'
        }`}>
            <div className="text-[10px] tracking-widest text-[#E85D26] mb-1.5">TOTAL ESTIMATE</div>
            <div className="text-3xl font-bold font-mono text-white transition-transform duration-200">
                ${totalPrice.toFixed(2)}
            </div>

            {/* Breakdown on hover */}
            <div className="absolute left-0 bottom-full mb-2 w-full bg-black/90 backdrop-blur-md p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-white">
                <div className="text-[10px] tracking-widest text-[#E85D26] mb-3 uppercase">Price Breakdown</div>
                {[
                    { label: 'Base', val: shoe?.base_price },
                    { label: 'Material', val: matPrice, prefix: '+' },
                    { label: 'Sole', val: solePrice, prefix: '+' },
                    { label: 'Accessories', val: accPrice, prefix: '+' },

                ].filter(r => r.val > 0).map((r, i) => (
                    <div key={i} className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{r.label}</span>
                        <span>{r.prefix || ''}${parseFloat(r.val).toFixed(2)}</span>
                    </div>
                ))}
                <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between text-xs font-bold">
                    <span>Total</span><span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
