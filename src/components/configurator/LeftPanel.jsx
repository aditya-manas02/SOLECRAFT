"use client";

import React from 'react';
import { useConfiguratorStore } from '@/store/configuratorStore';

export default function LeftPanel({ activeStep, setActiveStep }) {
    const { selectedMaterial, selectedSole, designName, accessories } = useConfiguratorStore();

    // Map material names to user-friendly titles
    const matLabel = {
        leather: "Full-grain Leather",
        suede: "Premium Suede",
        mesh: "Technical Mesh"
    }[selectedMaterial] || selectedMaterial;

    // Map sole names to user-friendly titles
    const soleLabel = {
        flat: "Classic Flat",
        platform: "Elevated Platform",
        trail: "Rugged Trail"
    }[selectedSole] || selectedSole;

    // Count active accessories
    const activeAccsCount = Object.values(accessories).filter(Boolean).length;
    const accsLabel = activeAccsCount > 0 ? `${activeAccsCount} Active` : "None Selected";

    const steps = [
        {
            num: "1",
            title: "UPPER",
            subtext: matLabel,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            num: "2",
            title: "LACES",
            subtext: "Cotton Waxed Laces",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            )
        },
        {
            num: "3",
            title: "SOLE",
            subtext: soleLabel,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )
        },
        {
            num: "4",
            title: "HARDWARE",
            subtext: accsLabel,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            num: "5",
            title: "MONOGRAM",
            subtext: designName || "Standard Logo",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            )
        }
    ];

    return (
        <div className="h-full bg-[#F5F3EF] p-8 flex flex-col justify-start select-none">
            
            {/* Step list container */}
            <div className="relative flex flex-col gap-10">
                
                {/* Timeline vertical linking bar */}
                <div className="absolute left-6 top-8 bottom-8 w-px border-l border-dashed border-[#CFCDBD]" />

                {steps.map((s, index) => {
                    const stepNum = index + 1;
                    const isSelected = activeStep === stepNum;
                    
                    return (
                        <button
                            key={s.num}
                            onClick={() => setActiveStep(stepNum)}
                            className="relative flex items-start gap-4 text-left group cursor-pointer focus:outline-none"
                        >
                            {/* Step number ring */}
                            <div 
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 transition-all ${
                                    isSelected 
                                        ? 'bg-[#111] border-[#111] text-white shadow-md' 
                                        : 'bg-[#F5F3EF] border-[#CFCDBD] text-[#888] group-hover:border-[#888]'
                                }`}
                            >
                                <span className="text-xs font-bold font-mono">{s.num}</span>
                            </div>

                            {/* Step info labels */}
                            <div className="pt-1">
                                <span className={`text-[10px] tracking-[0.2em] font-bold block ${isSelected ? 'text-[#111]' : 'text-[#888] group-hover:text-[#444]'}`}>
                                    {s.num}. {s.title}
                                </span>
                                <span className={`text-[11px] tracking-wider block mt-0.5 ${isSelected ? 'text-[#666] font-medium' : 'text-[#aaa]'}`}>
                                    {s.subtext}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {/* Design summary info */}
            <div className="mt-auto border-t border-[#E8E6DF] pt-6">
                <span className="text-[9px] tracking-[0.3em] font-bold text-[#aaa] uppercase block mb-1">Status Overview</span>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] tracking-wider text-[#666] font-bold">Studio Active</span>
                </div>
            </div>
        </div>
    );
}
