import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useThemeStore } from '../store/appStore';

const HERO_GRADIENTS = [
    'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    'linear-gradient(135deg, #0F3460 0%, #533483 50%, #E94560 100%)',
    'linear-gradient(135deg, #111111 0%, #2D2D2D 50%, #E85D26 100%)',
];

function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
    const [shoes, setShoes] = useState([]);
    const [heroIdx, setHeroIdx] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        axios.get('/api/shoes').then(r => setShoes(r.data.data)).catch(() => {});
        const interval = setInterval(() => setHeroIdx(i => (i + 1) % HERO_GRADIENTS.length), 8000);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { clearInterval(interval); window.removeEventListener('scroll', handleScroll); };
    }, []);

    return (
        <div className="min-h-screen font-mono" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* ─── HERO SECTION ─── */}
            <section
                className="relative h-screen flex items-center justify-center overflow-hidden transition-all duration-[3000ms] ease-in-out"
                style={{ background: HERO_GRADIENTS[heroIdx] }}
            >
                {/* Floating grid pattern */}
                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.02}deg)`,
                }} />

                {/* Glass Orbs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #E85D26, transparent)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 animate-pulse blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #4CC9F0, transparent)', animationDelay: '2s' }} />

                <div className="relative z-10 text-center px-6" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
                    <div className="text-[10px] tracking-[0.6em] text-[#E85D26] mb-8 uppercase animate-slide-in-down font-bold">
                        EST. 2026 // PREMIUM CUSTOM STUDIO
                    </div>
                    <h1 className="text-7xl md:text-[140px] font-bold text-white tracking-[0.15em] leading-none mb-8 drop-shadow-2xl animate-fade-in">
                        SOLE<span className="text-[#E85D26]">CRAFT</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-300 tracking-[0.4em] uppercase mb-16 max-w-xl mx-auto leading-loose animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        The intersection of high-fashion and <span className="text-white font-bold">real-time 3D engineering</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <Link
                            to="/configure/1"
                            className="group relative px-12 py-5 bg-[#E85D26] text-white tracking-[0.4em] text-[10px] uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(232,93,38,0.5)] hover:-translate-y-1"
                        >
                            <span className="relative z-10">Start Your Design</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </Link>
                        <Link
                            to="/collections"
                            className="px-12 py-5 border border-white/20 text-white tracking-[0.4em] text-[10px] uppercase hover:border-white hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
                        >
                            View Collection
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30 animate-bounce">
                    <span className="text-[8px] tracking-[0.5em] uppercase">Slide</span>
                    <div className="w-px h-12 bg-gradient-to-b from-[#E85D26] to-transparent" />
                </div>
            </section>

            {/* ─── PROCESS SECTION ─── */}
            <section className="py-40 px-8 max-w-7xl mx-auto relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E85D26]/5 rounded-full blur-3xl -z-10" />
                <div className="text-[10px] tracking-[0.6em] text-[#E85D26] mb-6 uppercase font-bold">The Craft</div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-24 max-w-2xl" style={{ color: 'var(--color-text)' }}>
                    ENGINEERED FOR <span className="italic text-[#E85D26]">EXPRESSION</span>.
                </h2>
                <div className="grid md:grid-cols-3 gap-20">
                    {[
                        { num: '01', title: 'SILHOUETTE', desc: 'Choose from 8 industry-standard base models, each optimized for 3D realism.' },
                        { num: '02', title: 'FABRICATION', desc: 'Apply premium full-grain leathers, technical meshes, or performance suedes.' },
                        { num: '03', title: 'EXECUTION', desc: 'Our master craftsmen build your unique design with millimeter precision.' },
                    ].map((step, i) => (
                        <div key={i} className="group relative">
                            <div className="text-8xl font-black text-[#E85D26]/10 group-hover:text-[#E85D26]/20 transition-all duration-700 absolute -top-12 -left-4">
                                {step.num}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xs tracking-[0.4em] font-bold mb-6 uppercase" style={{ color: 'var(--color-text)' }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed tracking-wide opacity-60" style={{ color: 'var(--color-text)' }}>{step.desc}</p>
                                <div className="mt-8 h-px w-0 bg-[#E85D26] group-hover:w-full transition-all duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── FEATURED SHOES ─── */}
            <section className="py-40 px-8" style={{ backgroundColor: darkMode ? '#111' : '#111' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div>
                            <div className="text-[10px] tracking-[0.6em] text-[#E85D26] mb-4 uppercase font-bold">Showcase</div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">BASE LINEUP</h2>
                        </div>
                        <Link to="/collections" className="text-[10px] tracking-[0.4em] text-gray-500 uppercase hover:text-[#E85D26] transition-colors pb-2 border-b border-gray-800">
                            Explore Full Catalog →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        {shoes.slice(0, 4).map((shoe, i) => (
                            <Link
                                key={shoe.id}
                                to={`/configure/${shoe.id}`}
                                className="group relative aspect-[16/9] bg-[#1A1A1A] p-12 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col justify-between"
                            >
                                {/* Background Image/Model Preview Placeholder */}
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" style={{
                                    background: `radial-gradient(circle at center, #E85D26 0%, transparent 70%)`,
                                    transform: 'scale(1.5)',
                                }} />
                                
                                <div className="relative z-10">
                                    <div className="text-[9px] tracking-[0.5em] text-[#E85D26] mb-4 font-bold uppercase">MODEL NO. {String(shoe.id).padStart(3, '0')}</div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white tracking-[0.1em]">{shoe.name.toUpperCase()}</h3>
                                </div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="text-4xl font-bold text-white font-mono">
                                        <span className="text-xs text-gray-500 mr-2">FROM</span>
                                        ${parseFloat(shoe.base_price).toFixed(0)}
                                    </div>
                                    <div className="px-6 py-3 border border-white/10 text-white text-[9px] tracking-[0.4em] uppercase group-hover:bg-[#E85D26] group-hover:border-[#E85D26] transition-all duration-500">
                                        Customize
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── STATS SECTION ─── */}
            <section className="py-32 px-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
                    {[
                        { value: 125000, suffix: '+', label: 'Designs Minted' },
                        { value: 48, suffix: '', label: 'Color Sectors' },
                        { value: 12, suffix: '', label: 'Material Finishes' },
                        { value: 99.8, suffix: '%', label: 'Craft Precision' },
                    ].map((stat, i) => (
                        <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i*100}ms` }}>
                            <div className="text-5xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-[9px] tracking-[0.5em] text-gray-500 uppercase font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA SECTION ─── */}
            <section className="py-48 px-8 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-[0.03] select-none pointer-events-none text-[200px] font-black tracking-tighter whitespace-nowrap"
                     style={{ color: 'var(--color-text)' }}>
                    SOLECRAFT SOLECRAFT SOLECRAFT
                </div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 uppercase" style={{ color: 'var(--color-text)' }}>
                    MAKE YOUR <span className="text-[#E85D26]">MARK</span>.
                </h2>
                <p className="text-sm text-gray-500 tracking-[0.3em] mb-16 max-w-lg mx-auto uppercase leading-relaxed">
                    The only limit is your imagination. Start your legacy today.
                </p>
                <Link
                    to="/configure/1"
                    className="inline-block px-16 py-6 bg-[#111] text-white tracking-[0.5em] text-xs uppercase hover:bg-[#E85D26] transition-all duration-700 hover:scale-105 dark:bg-[#E85D26] dark:hover:bg-[#D14F1E]"
                >
                    Launch Studio
                </Link>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-[#0D0D0D] py-24 px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
                    <div className="col-span-2">
                        <div className="text-3xl font-bold text-white tracking-[0.2em] mb-8">
                            SOLE<span className="text-[#E85D26]">CRAFT</span>
                        </div>
                        <p className="text-gray-500 text-sm tracking-widest max-w-sm uppercase leading-relaxed">
                            Pioneering the future of digital craftsmanship through interactive 3D experiences.
                        </p>
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.4em] text-white uppercase font-bold mb-8">Explore</div>
                        <ul className="space-y-4 text-xs tracking-widest text-gray-500 uppercase">
                            <li><Link to="/collections" className="hover:text-[#E85D26] transition-colors">Collections</Link></li>
                            <li><Link to="/gallery" className="hover:text-[#E85D26] transition-colors">Gallery</Link></li>
                            <li><Link to="/configure/1" className="hover:text-[#E85D26] transition-colors">Customizer</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.4em] text-white uppercase font-bold mb-8">Support</div>
                        <ul className="space-y-4 text-xs tracking-widest text-gray-500 uppercase">
                            <li><a href="#" className="hover:text-[#E85D26] transition-colors">Shipping</a></li>
                            <li><a href="#" className="hover:text-[#E85D26] transition-colors">Returns</a></li>
                            <li><a href="#" className="hover:text-[#E85D26] transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] tracking-[0.4em] text-gray-600 uppercase">
                        © 2026 SOLECRAFT. ENGINEERED BY THE FUTURE.
                    </div>
                    <div className="flex gap-8">
                        <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase cursor-pointer hover:text-white transition-colors">Twitter</span>
                        <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase cursor-pointer hover:text-white transition-colors">Instagram</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
