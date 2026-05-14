import React, { useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Html } from '@react-three/drei';
import { PlaceholderShoe } from '../components/configurator/PlaceholderShoe';
import { ShoeModel } from '../components/configurator/ShoeModel';
import axios from 'axios';
import { useThemeStore } from '../store/appStore';

export default function Collections() {
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        axios.get('/api/shoes')
            .then(r => { setShoes(r.data.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const cardBg = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';

    return (
        <div className="min-h-screen font-mono pt-16" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* ─── PAGE HEADER ─── */}
            <section className="relative py-32 px-8 bg-[#0D0D0D] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
                
                {/* Accent glow */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E85D26] rounded-full blur-[150px] opacity-20" />

                <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
                    <div className="text-[10px] tracking-[0.6em] text-[#E85D26] mb-4 uppercase font-bold">The Catalog</div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                        SILHOUETTE <span className="text-[#E85D26]">ARCHIVE</span>
                    </h1>
                    <p className="text-sm text-gray-400 tracking-[0.3em] max-w-2xl leading-relaxed uppercase">
                        Select your foundational canvas. Each model is a masterpiece of ergonomics and digital craftsmanship, ready for your transformation.
                    </p>
                </div>
            </section>

            {/* ─── SHOES GRID ─── */}
            <section className="py-24 px-8">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton h-[500px] rounded" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-12">
                            {shoes.map((shoe, i) => (
                                <Link
                                    key={shoe.id}
                                    to={`/configure/${shoe.id}`}
                                    className={`group relative flex flex-col border overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] animate-fade-in-up ${cardBg}`}
                                    style={{ animationDelay: `${i * 100}ms` }}
                                    onMouseEnter={() => setHoveredId(shoe.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Visual Preview Area */}
                                    <div className="relative h-[400px] bg-gradient-to-br from-[#f8f8f8] to-[#eee] dark:from-[#111] dark:to-[#0a0a0a] flex items-center justify-center overflow-hidden">
                                        {/* Watermark */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-black text-black/[0.03] dark:text-white/[0.02] select-none pointer-events-none transition-transform duration-[2000ms] group-hover:scale-150">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* 3D Model Preview */}
                                        <div className="absolute inset-0 z-10 pointer-events-none">
                                            {hoveredId === shoe.id ? (
                                                <Canvas shadows camera={{ position: [2, 1, 3], fov: 45 }}>
                                                    <Suspense fallback={
                                                        <Html center>
                                                            <div className="relative flex items-center justify-center scale-75 opacity-50">
                                                                <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#E85D26]/50 animate-spin-fast" style={{ animationDuration: '1s' }} />
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#E85D26] font-bold text-[8px] tracking-[0.3em] uppercase animate-pulse">
                                                                    Loading
                                                                </div>
                                                            </div>
                                                        </Html>
                                                    }>
                                                        <ambientLight intensity={0.6} />
                                                        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
                                                        {shoe.model_file && shoe.model_file !== 'placeholder' ? (
                                                            <ShoeModel modelPath={`/models/shoes/${shoe.model_file}`} />
                                                        ) : (
                                                            <PlaceholderShoe />
                                                        )}
                                                        <Environment preset="studio" />
                                                        <ContactShadows position={[0, -0.465, 0]} opacity={0.5} scale={5} blur={1.5} far={0.8} resolution={512} />
                                                    </Suspense>
                                                </Canvas>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-80 transition-opacity">
                                                    <div className="relative flex items-center justify-center">
                                                        <div className={`w-32 h-32 rounded-full border-2 border-dashed border-[#E85D26]/20 animate-spin-slow`} />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-16 h-16 bg-[#E85D26] rounded-full opacity-20 blur-xl" />
                                                            <svg className="w-20 h-20 text-[#111] dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Interactive label */}
                                        <div className="absolute bottom-8 left-8 flex items-center gap-4 animate-slide-in-left opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-12 h-px bg-[#E85D26]" />
                                            <span className="text-[8px] tracking-[0.5em] text-[#E85D26] uppercase font-bold">Interactive 3D Ready</span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-10 flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <div className="text-[10px] tracking-[0.5em] text-[#E85D26] mb-2 font-bold uppercase">Archive Ref // {shoe.slug}</div>
                                                <h3 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
                                                    {shoe.name.toUpperCase()}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                                                    ${parseFloat(shoe.base_price).toFixed(0)}
                                                </div>
                                                <div className="text-[8px] tracking-[0.4em] text-gray-500 uppercase font-bold mt-1">Starting Price</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-12 mb-10">
                                            <div>
                                                <h4 className="text-[9px] tracking-[0.4em] text-gray-500 uppercase font-bold mb-4">Specs</h4>
                                                <div className="space-y-2 text-[10px] tracking-widest uppercase opacity-70" style={{ color: 'var(--color-text)' }}>
                                                    <div>• {shoe.available_materials?.length} Premium Materials</div>
                                                    <div>• {shoe.available_soles?.length} Sole Configurations</div>
                                                    <div>• 24 Customization Zones</div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[9px] tracking-[0.4em] text-gray-500 uppercase font-bold mb-4">Highlights</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {shoe.available_materials?.slice(0, 3).map(m => (
                                                        <span key={m.id} className="text-[8px] tracking-widest uppercase px-2 py-1 border border-current opacity-30">{m.id}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative group/btn">
                                            <div className="absolute inset-0 bg-[#E85D26] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                            <div className="relative z-10 py-5 border border-current text-center text-[10px] tracking-[0.5em] uppercase font-bold transition-colors duration-500 group-hover:text-white"
                                                 style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                                Customize silhouette →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ─── BOTTOM BANNER ─── */}
            <section className="py-32 px-8 bg-[#E85D26] text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">HAVE A SPECIFIC VISION?</h2>
                    <p className="text-sm tracking-[0.3em] uppercase mb-12 opacity-80 leading-loose">
                        Our studio team can help with custom artwork and bulk orders for teams and events.
                    </p>
                    <a href="mailto:studio@solecraft.com" className="inline-block px-12 py-5 border-2 border-white text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-white hover:text-[#E85D26] transition-all duration-500">
                        Contact Studio
                    </a>
                </div>
            </section>
        </div>
    );
}
