import React, { useEffect, useState, Suspense, useRef, Component } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { PlaceholderShoe } from '../components/configurator/PlaceholderShoe';
import { ShoeModel } from '../components/configurator/ShoeModel';
import axios from 'axios';
import { useThemeStore } from '../store/appStore';
import { useInView } from 'react-intersection-observer';

// ─── ERROR BOUNDARY ───
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <PlaceholderShoe />;
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
            groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;
            groupRef.current.rotation.y += 0.02;
            groupRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
        } else {
            groupRef.current.rotation.y = 0.5;
            groupRef.current.scale.lerp(new THREE.Vector3(0.9, 0.9, 0.9), 0.1);
            groupRef.current.position.y = 0;
        }
    });

    return (
        <group ref={groupRef}>
            <ModelErrorBoundary>
                {shoe.model_file && shoe.model_file !== 'placeholder' ? (
                    <ShoeModel modelPath={`/models/shoes/${shoe.model_file}`} />
                ) : (
                    <PlaceholderShoe />
                )}
            </ModelErrorBoundary>
        </group>
    );
}

// ─── OPTIMIZED CARD PREVIEW COMPONENT ───
function ShoeCardPreview({ shoe, i }) {
    // We use a large rootMargin (400px) so models start loading BEFORE they enter the screen
    const { ref, inView } = useInView({
        threshold: 0.01,
        rootMargin: '400px',
        triggerOnce: false,
    });
    const [hovered, setHovered] = useState(false);
    
    return (
        <div 
            ref={ref}
            className="relative h-[400px] bg-black overflow-hidden flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#000]" />
            
            {inView ? (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <Canvas 
                        shadows={false}
                        dpr={1}
                        camera={{ position: [3, 1.5, 4], fov: 35 }}
                        frameloop={hovered ? 'always' : 'demand'}
                    >
                        <Suspense fallback={null}>
                            <ambientLight intensity={1.5} />
                            <pointLight position={[5, 5, 5]} intensity={2} color="#E85D26" />
                            <pointLight position={[-5, -5, -5]} intensity={1} color="#fff" />
                            
                            <ShoePreview shoe={shoe} isHovered={hovered} />
                            
                            <Environment preset="city" />
                        </Suspense>
                    </Canvas>
                </div>
            ) : (
                <div className="text-[160px] font-black italic opacity-[0.03] select-none text-white">
                    {String(i + 1).padStart(2, '0')}
                </div>
            )}

            <div className="absolute bottom-10 left-10 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#E85D26]/40" />
                <span className="text-[8px] tracking-[0.5em] text-[#E85D26] uppercase font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                    {hovered ? 'Neural Link Active' : 'Model Standby'}
                </span>
            </div>
        </div>
    );
}

export default function Collections() {
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const darkMode = useThemeStore(s => s.darkMode);

    const handleMouseMove = (e, id) => {
        if (hoveredId !== id) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 10, y: y * -10 });
    };

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
                setLoading(false); 

                // PRELOAD: Fetch all models in the background immediately
                cleanedShoes.forEach(shoe => {
                    if (shoe.model_file && shoe.model_file !== 'placeholder') {
                        useGLTF.preload(`/models/shoes/${shoe.model_file}`);
                    }
                });
            })
            .catch(() => setLoading(false));
    }, []);

    const cardBg = darkMode ? 'bg-[#0A0A0A] border-[#1A1A1A]' : 'bg-white border-[#E5E5E5]';

    return (
        <div className="min-h-screen font-mono pt-16 relative" style={{ backgroundColor: 'var(--color-bg)' }}>
            
            {/* ─── PAGE HEADER ─── */}
            <section className="relative py-32 px-8 bg-[#0D0D0D] overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
                <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
                    <div className="text-[10px] tracking-[0.6em] text-[#E85D26] mb-4 uppercase font-bold">Catalog Archive</div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 uppercase">
                        Sole<span className="text-[#E85D26]">Craft</span> Grid
                    </h1>
                </div>
            </section>

            {/* ─── SHOES GRID ─── */}
            <section className="py-24 px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12">
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-[500px] rounded" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12">
                            {shoes.map((shoe, i) => (
                                <Link
                                    key={shoe.id}
                                    to={`/configure/${shoe.id}`}
                                    className={`group relative flex flex-col border overflow-hidden transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(232,93,38,0.3)] ${cardBg} border-opacity-10`}
                                    style={{ 
                                        animationDelay: `${i * 100}ms`,
                                        transform: hoveredId === shoe.id ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-10px)` : 'none',
                                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                    }}
                                    onMouseEnter={() => setHoveredId(shoe.id)}
                                    onMouseMove={(e) => handleMouseMove(e, shoe.id)}
                                    onMouseLeave={() => { setHoveredId(null); setTilt({ x: 0, y: 0 }); }}
                                >
                                    {/* Visual Preview Area */}
                                    <ShoeCardPreview shoe={shoe} i={i} />

                                    {/* Content Area */}
                                    <div className="p-8 flex-1 flex flex-col justify-between relative bg-[#0D0D0D] border-t border-white/5">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="text-[9px] tracking-[0.4em] text-[#E85D26] mb-2 font-bold uppercase opacity-60">Prototype // {shoe.slug}</div>
                                                <h3 className="text-2xl font-black tracking-tighter text-white">
                                                    {shoe.name.toUpperCase()}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-[#E85D26]">
                                                    ${parseFloat(shoe.base_price).toFixed(0)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative group/btn overflow-hidden">
                                            <div className="absolute inset-0 bg-[#E85D26] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                                            <div className="relative z-10 py-4 border border-white/10 text-center text-[9px] tracking-[0.5em] uppercase font-bold transition-all duration-500 group-hover/btn:text-white group-hover/btn:tracking-[0.7em] text-white">
                                                Configure Now
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
