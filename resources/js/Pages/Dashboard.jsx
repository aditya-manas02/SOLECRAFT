import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore, useToastStore, useThemeStore } from '../store/appStore';

export default function Dashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);
    const navigate = useNavigate();
    const [designs, setDesigns] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('designs');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/auth');
            return;
        }
        if (isAuthenticated) {
            Promise.all([
                axios.get('/api/designs/mine').catch(() => ({ data: { data: [] } })),
                axios.get('/api/orders/mine').catch(() => ({ data: { data: [] } })),
            ]).then(([dRes, oRes]) => {
                setDesigns(dRes.data.data || []);
                setOrders(oRes.data.data || []);
                setLoading(false);
            });
        }
    }, [isAuthenticated, authLoading]);

    const deleteDesign = async (id) => {
        if (!confirm('Delete this design?')) return;
        try {
            await axios.delete(`/api/designs/${id}`);
            setDesigns(d => d.filter(x => x.id !== id));
            addToast('Design deleted', 'success');
        } catch { addToast('Failed to delete', 'error'); }
    };

    const statusColor = (s) => {
        const map = { placed: 'text-blue-500', processing: 'text-amber-500', shipped: 'text-purple-500', delivered: 'text-emerald-500', cancelled: 'text-red-500' };
        return map[s] || 'text-gray-500';
    };

    const cardBg = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';

    if (authLoading || loading) {
        return (
            <div className="min-h-screen pt-24 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="skeleton h-8 w-48 mb-8" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <div className="text-[10px] tracking-[0.5em] text-[#E85D26] uppercase mb-2">Dashboard</div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-wider font-mono" style={{ color: 'var(--color-text)' }}>
                        Welcome, {user?.name?.split(' ')[0]}
                    </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Designs', value: designs.length, icon: '✦' },
                        { label: 'Orders', value: orders.length, icon: '📦' },
                        { label: 'Public', value: designs.filter(d => d.is_public).length, icon: '🌐' },
                        { label: 'Active', value: orders.filter(o => !['cancelled','delivered'].includes(o.status)).length, icon: '⚡' },
                    ].map((s, i) => (
                        <div key={i} className={`p-5 border ${cardBg} animate-fade-in`} style={{ animationDelay: `${i*100}ms` }}>
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>{s.value}</div>
                            <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    {['designs', 'orders'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                                className={`pb-3 text-xs tracking-[0.3em] uppercase font-mono border-b-2 transition-colors ${tab === t ? 'border-[#E85D26] text-[#E85D26]' : 'border-transparent'}`}
                                style={tab !== t ? { color: 'var(--color-text-muted)' } : {}}>
                            My {t}
                        </button>
                    ))}
                </div>

                {/* Designs Tab */}
                {tab === 'designs' && (
                    <div>
                        {designs.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-5xl mb-4">👟</div>
                                <p className="text-sm tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>No designs yet. Start creating!</p>
                                <Link to="/configure/1" className="px-8 py-3 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase hover:bg-[#D14F1E] transition-colors">
                                    Start Designing
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {designs.map((design, i) => (
                                    <div key={design.id} className={`border overflow-hidden group animate-fade-in ${cardBg}`}
                                         style={{ animationDelay: `${i*80}ms` }}>
                                        {/* Color swatch preview */}
                                        <div className="flex h-20">
                                            {design.color_zones && Object.values(design.color_zones).map((c, j) => (
                                                <div key={j} className="flex-1 transition-transform duration-300 group-hover:scale-y-110" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <div className="p-5">
                                            <div className="text-[10px] tracking-[0.3em] text-[#E85D26] uppercase mb-1">{design.material}</div>
                                            <h3 className="font-bold tracking-wider font-mono mb-1" style={{ color: 'var(--color-text)' }}>
                                                {design.design_name || 'Untitled'}
                                            </h3>
                                            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                                                {design.shoe?.name} · ${parseFloat(design.total_price).toFixed(0)}
                                            </p>
                                            <div className="flex gap-2">
                                                <Link to={`/configure/${design.shoe_id}`}
                                                      className="flex-1 py-2 text-center text-[10px] tracking-widest uppercase border hover:bg-[#E85D26] hover:text-white hover:border-[#E85D26] transition-colors"
                                                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                                    Edit
                                                </Link>
                                                <button onClick={() => deleteDesign(design.id)}
                                                        className="py-2 px-4 text-[10px] tracking-widest uppercase border border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                                                    ✕
                                                </button>
                                            </div>
                                            {design.share_token && (
                                                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/shared/${design.share_token}`); addToast('Share link copied!', 'info'); }}
                                                        className="w-full mt-2 py-2 text-[10px] tracking-widest uppercase hover:text-[#E85D26] transition-colors"
                                                        style={{ color: 'var(--color-text-muted)' }}>
                                                    🔗 Copy Share Link
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div>
                        {orders.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-5xl mb-4">📦</div>
                                <p className="text-sm tracking-wider" style={{ color: 'var(--color-text-muted)' }}>No orders yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, i) => (
                                    <div key={order.id} className={`p-6 border animate-fade-in ${cardBg}`}
                                         style={{ animationDelay: `${i*80}ms` }}>
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <div className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                                    {order.tracking_number}
                                                </div>
                                                <h3 className="font-bold tracking-wider font-mono" style={{ color: 'var(--color-text)' }}>
                                                    {order.design?.design_name || order.design?.shoe_name || 'Custom Sneaker'}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                                                    ${parseFloat(order.total_price).toFixed(2)}
                                                </div>
                                                <span className={`text-xs tracking-widest uppercase font-bold ${statusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                            Placed: {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
