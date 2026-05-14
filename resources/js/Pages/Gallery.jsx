import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useThemeStore } from '../store/appStore';

export default function Gallery() {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        const params = filter !== 'all' ? { material: filter } : {};
        axios.get('/api/designs/gallery', { params })
            .then(r => { setDesigns(r.data.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [filter]);

    const materials = ['all', 'leather', 'suede', 'mesh', 'canvas', 'patent', 'knit'];
    const cardBg = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';

    return (
        <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <section className="py-16 px-6 md:px-8 relative overflow-hidden" 
                     style={{ background: darkMode ? 'linear-gradient(135deg, #0D0D0D, #1A1A2E)' : 'linear-gradient(135deg, #111, #1A1A2E)' }}>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-[10px] tracking-[0.5em] text-[#E85D26] mb-3 uppercase">Community</div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wider font-mono mb-4">DESIGN GALLERY</h1>
                    <p className="text-sm text-gray-400 tracking-wider max-w-lg">
                        Explore designs from creators around the world. Get inspired and start your own.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <div className="px-6 md:px-8 py-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="max-w-6xl mx-auto flex flex-wrap gap-3">
                    {materials.map(m => (
                        <button key={m} onClick={() => setFilter(m)}
                                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-mono border transition-colors ${
                                    filter === m ? 'bg-[#E85D26] text-white border-[#E85D26]' : `hover:border-[#E85D26] hover:text-[#E85D26]`
                                }`}
                                style={filter !== m ? { borderColor: 'var(--color-border)', color: 'var(--color-text)' } : {}}>
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-56 rounded" />)}
                    </div>
                ) : designs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🎨</div>
                        <p className="text-sm tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>
                            No public designs yet. Be the first to share!
                        </p>
                        <Link to="/configure/1" className="px-8 py-3 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase">
                            Create Design
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.map((design, i) => (
                            <div key={design.id} className={`border overflow-hidden group animate-fade-in ${cardBg}`}
                                 style={{ animationDelay: `${i*60}ms` }}>
                                <div className="flex h-24">
                                    {design.color_zones && Object.values(design.color_zones).map((c, j) => (
                                        <div key={j} className="flex-1 transition-transform duration-500 group-hover:scale-y-110"
                                             style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-[10px] tracking-[0.3em] text-[#E85D26] uppercase">{design.material}</div>
                                        <div className="text-xs font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                                            ${parseFloat(design.total_price).toFixed(0)}
                                        </div>
                                    </div>
                                    <h3 className="font-bold tracking-wider font-mono mb-1" style={{ color: 'var(--color-text)' }}>
                                        {design.design_name || 'Untitled'}
                                    </h3>
                                    <p className="text-[10px] tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                        by {design.user?.name || 'Anonymous'}
                                    </p>
                                    {design.share_token && (
                                        <Link to={`/shared/${design.share_token}`}
                                              className="block w-full py-2.5 text-center text-[10px] tracking-widest uppercase border hover:bg-[#E85D26] hover:text-white hover:border-[#E85D26] transition-colors"
                                              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                            View in 3D →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
