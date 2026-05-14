import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore, useToastStore, useThemeStore } from '../store/appStore';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    
    const [form, setForm] = useState({
        customer_name: '',
        customer_email: '',
        shipping_address: '',
        payment_method: 'cod'
    });

    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        setForm(f => ({ ...f, customer_name: user?.name || '', customer_email: user?.email || '' }));
        fetchCart();
    }, [isAuthenticated, user]);

    const fetchCart = async () => {
        try {
            const res = await axios.get('/api/cart');
            if (res.data.length === 0) {
                navigate('/cart');
            }
            setCart(res.data);
        } catch (e) {
            addToast('Failed to load checkout', 'error');
        }
        setLoading(false);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setPlacing(true);
        try {
            const res = await axios.post('/api/orders/place', {
                items: cart,
                ...form
            });
            if (res.data.success) {
                addToast('Order placed successfully! 🎉', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to place order', 'error');
        }
        setPlacing(false);
    };

    const total = cart.reduce((acc, curr) => acc + Number(curr.total_price), 0);
    const bgClass = darkMode ? 'bg-[#0D0D0D] text-white' : 'bg-[#FAFAFA] text-[#111]';
    const cardBg = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';
    const inp = `w-full px-4 py-3 text-sm border focus:outline-none focus:border-[#E85D26] ${darkMode ? 'bg-[#222] border-[#333] text-white' : 'bg-white border-[#E5E5E5] text-[#111]'}`;

    if (loading) return null;

    return (
        <div className={`min-h-screen pt-24 font-mono ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-3xl font-bold tracking-tighter uppercase mb-10">Checkout</h1>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest uppercase mb-6 text-[#E85D26]">Shipping Details</h2>
                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2 opacity-70">Full Name</label>
                                <input type="text" required value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className={inp} />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2 opacity-70">Email Address</label>
                                <input type="email" required value={form.customer_email} onChange={e => setForm({...form, customer_email: e.target.value})} className={inp} />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2 opacity-70">Shipping Address</label>
                                <textarea required rows="3" value={form.shipping_address} onChange={e => setForm({...form, shipping_address: e.target.value})} className={inp} />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2 opacity-70">Payment Method</label>
                                <select value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})} className={inp}>
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="card">Credit Card (Demo)</option>
                                </select>
                            </div>
                            
                            <button type="submit" disabled={placing} className="w-full mt-6 py-4 bg-[#E85D26] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#D14F1E] transition-colors disabled:opacity-50">
                                {placing ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className={`p-6 border ${cardBg}`}>
                            <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-xs tracking-wider">
                                        <div>
                                            <span className="uppercase block">1x Custom Sneaker</span>
                                            <span className="opacity-50 text-[10px]">{item.material} / {item.sole_type}</span>
                                        </div>
                                        <span>${Number(item.total_price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-500 font-bold tracking-wider">
                                <span>Total To Pay</span>
                                <span className="text-[#E85D26] text-xl">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
