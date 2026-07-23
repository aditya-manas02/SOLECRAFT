"use client";

import React, { useEffect, useState, Suspense, useRef, Component } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PlaceholderShoe } from '@/components/configurator/PlaceholderShoe';
import { ShoeModel } from '@/components/configurator/ShoeModel';
import axios from 'axios';
import { useThemeStore } from '@/store/appStore';
import { useInView } from 'react-intersection-observer';

// ─── ERROR BOUNDARY ───
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <PlaceholderShoe clay={true} />;
    return this.props.children;
  }
}

// ─── OPTIMIZED SHOE PREVIEW ───
function ShoePreview({ shoe, isHovered }) {
    const groupRef = useRef();
    
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();
        
        if (isHovered) {
            groupRef.current.position.y = -0.25 + Math.sin(t * 1.5) * 0.03;
            groupRef.current.rotation.y += 0.012;
            groupRef.current.scale.lerp(new THREE.Vector3(0.9, 0.9, 0.9), 0.1);
        } else {
            groupRef.current.rotation.y = 0.5;
            groupRef.current.scale.lerp(new THREE.Vector3(0.78, 0.78, 0.78), 0.1);
            groupRef.current.position.y = -0.25;
        }
    });

    return (
        <group ref={groupRef}>
            <ModelErrorBoundary>
                {shoe.model_file && shoe.model_file !== 'placeholder' ? (
                    <ShoeModel modelPath={`/models/shoes/${shoe.model_file}`} />
                ) : (
                    <PlaceholderShoe clay={true} />
                )}
            </ModelErrorBoundary>
        </group>
    );
}

// ─── OPTIMIZED CARD PREVIEW COMPONENT ───
function ShoeCardPreview({ shoe, isHovered }) {
    const { ref, inView } = useInView({
        threshold: 0.01,
        rootMargin: '200px',
        triggerOnce: false,
    });
    
    return (
        <div 
            ref={ref}
            className="relative h-[280px] bg-[#F5F3EF] border-b border-[#E8E6DF] overflow-hidden flex items-center justify-center transition-colors duration-300"
        >
            {/* Soft background lighting vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.75)_0%,rgba(238,236,230,0.45)_100%)]" />
            
            {/* 
              PERFORMANCE & FRAMING OPTIMIZATION:
              - Adjusted camera position [3, 0.6, 3.8] and fov: 42 to ensure models are perfectly centered.
              - Reset group Y-position to -0.25 and scale to 0.78 to prevent model clipping at the top.
            */}
            {inView ? (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <Canvas 
                        shadows={false}
                        dpr={1}
                        camera={{ position: [3, 0.6, 3.8], fov: 42 }}
                        frameloop={isHovered ? 'always' : 'demand'}
                    >
                        <Suspense fallback={<PlaceholderShoe clay={true} scale={[0.78, 0.78, 0.78]} position={[0, -0.25, 0]} rotation={[0, 0.5, 0]} />}>
                            <ambientLight intensity={1.5} />
                            <pointLight position={[5, 5, 5]} intensity={1.5} color="#E85D26" />
                            <pointLight position={[-5, -5, -5]} intensity={0.8} color="#fff" />
                            
                            <ShoePreview shoe={shoe} isHovered={isHovered} />
                            
                            <Environment preset="city" />
                        </Suspense>
                    </Canvas>
                </div>
            ) : (
                <div className="w-10 h-10 border-2 border-t-[#E85D26] rounded-full animate-spin" style={{ borderColor: '#E5E5E5', borderTopColor: '#E85D26' }} />
            )}

            {/* Glowing active state indicators */}
            <div className="absolute bottom-5 left-6 flex items-center gap-2 z-20">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHovered ? 'bg-[#E85D26] scale-125' : 'bg-[#CFCDBD]'}`} />
                <span className="text-[7px] tracking-[0.3em] text-[#888] uppercase font-bold">
                    {isHovered ? 'Interactive 3D' : 'Standby'}
                </span>
            </div>
        </div>
    );
}

export default function Collections() {
    const [shoes, setShoes] = useState([]);
    const [filteredShoes, setFilteredShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMaterialFilter, setActiveMaterialFilter] = useState("all"); // all | leather | suede

    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        axios.get('/api/shoes')
            .then(r => { 
                const cleanedShoes = r.data.data.map(s => {
                    if (s.model_file === 'sneakers-seen/scene.gltf') {
                        return { ...s, model_file: 'sneakers-seen/source/Seen_low_2K.glb' };
                    }
                    return s;
                });
                setShoes(cleanedShoes); 
                setFilteredShoes(cleanedShoes);
                setLoading(false); 
            })
            .catch(() => setLoading(false));
    }, []);

    // Filter logic
    useEffect(() => {
        let result = shoes;

        // Search query filter
        if (searchQuery.trim()) {
            result = result.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.slug.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Material filter
        if (activeMaterialFilter !== "all") {
            result = result.filter(s => {
                const mats = s.available_materials ? (typeof s.available_materials === 'string' ? JSON.parse(s.available_materials) : s.available_materials) : [];
                return mats.some(m => m.id === activeMaterialFilter);
            });
        }

        setFilteredShoes(result);
    }, [searchQuery, activeMaterialFilter, shoes]);

    return (
        <div className="min-h-screen font-mono relative bg-[#FAF9F6] text-[#111] animate-fade-in">
            
            {/* ─── PAGE HEADER ─── */}
            <section className="relative py-20 px-8 border-b border-[#E8E6DF] bg-[#F5F3EF]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="text-[10px] tracking-[0.5em] text-[#888] mb-3 uppercase font-bold">Catalog Showcase</div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#111] tracking-tight uppercase">
                            SELECT PROTOTYPE
                        </h1>
                        <p className="text-[11px] text-[#666] tracking-wider mt-2 max-w-md">
                            Browse our curated collection of signature 3D templates and start customizing your personalized sneaker.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-8 border-l border-[#E8E6DF] pl-8 py-2 text-[10px] tracking-widest uppercase text-[#888]">
                        <div><span className="block font-black text-lg text-[#111] font-mono leading-none mb-1">{shoes.length}</span> Prototypes</div>
                        <div><span className="block font-black text-lg text-[#111] font-mono leading-none mb-1">3</span> Materials</div>
                    </div>
                </div>
            </section>

            {/* ─── FILTER & SEARCH CONTROLS ─── */}
            <section className="py-6 px-8 border-b border-[#E8E6DF] bg-[#F5F3EF]/60 backdrop-blur-md sticky top-16 z-30">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
                    
                    {/* Material Filter Pills */}
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'All Models' },
                            { id: 'leather', label: 'Leather' },
                            { id: 'suede', label: 'Suede' }
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setActiveMaterialFilter(f.id)}
                                className={`px-5 py-2 text-[9px] tracking-[0.2em] uppercase font-bold border rounded-full transition-all cursor-pointer ${
                                    activeMaterialFilter === f.id
                                        ? 'bg-black text-white border-black shadow-sm'
                                        : 'bg-white border-[#E8E6DF] text-[#888] hover:border-[#aaa]'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="SEARCH CATALOG..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-[#E8E6DF] rounded-full py-2.5 pl-5 pr-10 text-[10px] tracking-widest font-bold uppercase focus:outline-none focus:border-[#111] text-[#111] placeholder-[#aaa]"
                        />
                        <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                </div>
            </section>

            {/* ─── SHOES GRID ─── */}
            <section className="py-16 px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white border border-[#E8E6DF] rounded-2xl h-[480px] animate-pulse" />
                            ))}
                        </div>
                    ) : filteredShoes.length === 0 ? (
                        <div className="text-center py-24 bg-[#F5F3EF] border border-[#E8E6DF] rounded-2xl">
                            <div className="text-4xl mb-4">🔍</div>
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#888]">No matching prototypes found</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {filteredShoes.map((shoe, i) => {
                                const isHovered = hoveredId === shoe.id;
                                
                                return (
                                    <div
                                        key={shoe.id}
                                        onMouseEnter={() => setHoveredId(shoe.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        className="group bg-white border border-[#E8E6DF] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                                    >
                                        {/* Visual Preview Area */}
                                        <ShoeCardPreview shoe={shoe} isHovered={isHovered} />

                                        {/* Content details Area */}
                                        <div className="p-7 flex flex-col justify-between flex-1 gap-6">
                                            
                                            {/* Shoe Title & Price */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[9px] tracking-[0.3em] text-[#888] block mb-1.5 uppercase font-bold">
                                                        PROTOTYPE // {shoe.slug.substring(0, 16)}
                                                    </span>
                                                    <h3 className="text-lg font-black tracking-tight text-[#111] uppercase leading-snug">
                                                        {shoe.name}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-black text-[#111] font-mono leading-none block">
                                                        ${parseFloat(shoe.base_price).toFixed(0)}
                                                    </span>
                                                    <span className="text-[7px] tracking-widest text-[#888] uppercase block mt-0.5">
                                                        USD
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Dynamic material tags */}
                                            <div className="flex flex-wrap gap-1.5 border-t border-[#E8E6DF] pt-4">
                                                {shoe.available_materials && (typeof shoe.available_materials === 'string' ? JSON.parse(shoe.available_materials) : shoe.available_materials).map(m => (
                                                    <span key={m.id} className="px-2.5 py-1 bg-[#F5F3EF] border border-[#E8E6DF] text-[8px] tracking-wider uppercase font-bold text-[#666] rounded">
                                                        {m.label}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA Button */}
                                            <Link
                                                href={`/configure/${shoe.id}`}
                                                className={`w-full py-3.5 text-center text-[9px] tracking-[0.25em] uppercase font-black rounded-full transition-all border flex items-center justify-center gap-2 ${
                                                    isHovered 
                                                        ? 'bg-black text-white border-black shadow-sm' 
                                                        : 'bg-white border-[#E8E6DF] text-[#111] hover:border-[#111]'
                                                }`}
                                            >
                                                Configure Now
                                                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
