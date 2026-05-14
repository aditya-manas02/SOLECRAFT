import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore, useThemeStore, useToastStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuthStore();
    const darkMode = useThemeStore(s => s.darkMode);
    const addToast = useToastStore(s => s.addToast);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        if (user?.role !== 'admin') {
            addToast('Access Denied. Admins only.', 'error');
            navigate('/dashboard');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/admin/orders');
            setOrders(res.data.data);
        } catch (e) {
            addToast('Failed to load orders', 'error');
        }
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await axios.put(`/api/admin/orders/${id}/status`, { status });
            if (res.data.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
                addToast(`Order marked as ${status}`, 'success');
            }
        } catch (e) {
            addToast('Failed to update status', 'error');
        }
    };

    const bgClass = darkMode ? 'bg-[#0D0D0D] text-white' : 'bg-[#FAFAFA] text-[#111]';
    const cardBg = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';

    if (loading) return null;

    return (
        <div className={`min-h-screen pt-24 font-mono ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2 text-[#E85D26]">Admin Control Center</h1>
                <p className="text-xs tracking-widest uppercase opacity-60 mb-10">Manage Incoming Orders</p>
                
                {orders.length === 0 ? (
                    <div className="p-10 text-center opacity-50">No orders found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className={`w-full text-left border-collapse text-xs tracking-wider uppercase ${cardBg}`}>
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                                        <td className="p-4 text-[#E85D26] font-bold">#{o.tracking_number}</td>
                                        <td className="p-4">
                                            {o.customer_name}<br/>
                                            <span className="text-[10px] opacity-60">{o.customer_email}</span>
                                        </td>
                                        <td className="p-4">${Number(o.total_price).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 border ${
                                                o.status === 'placed' ? 'text-yellow-500 border-yellow-500' :
                                                o.status === 'accepted' ? 'text-blue-500 border-blue-500' :
                                                o.status === 'rejected' ? 'text-red-500 border-red-500' :
                                                'text-green-500 border-green-500'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="p-4 opacity-70">{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-right space-x-2">
                                            {o.status === 'placed' && (
                                                <>
                                                    <button onClick={() => updateStatus(o.id, 'accepted')} className="px-3 py-1 bg-green-600 text-white hover:bg-green-700">Accept</button>
                                                    <button onClick={() => updateStatus(o.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white hover:bg-red-700">Reject</button>
                                                </>
                                            )}
                                            {o.status === 'accepted' && (
                                                <button onClick={() => updateStatus(o.id, 'manufacturing')} className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700">Start Mfg</button>
                                            )}
                                            {o.status === 'manufacturing' && (
                                                <button onClick={() => updateStatus(o.id, 'shipped')} className="px-3 py-1 bg-purple-600 text-white hover:bg-purple-700">Ship</button>
                                            )}
                                            {o.status === 'shipped' && (
                                                <button onClick={() => updateStatus(o.id, 'delivered')} className="px-3 py-1 bg-[#E85D26] text-white hover:bg-[#D14F1E]">Delivered</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
