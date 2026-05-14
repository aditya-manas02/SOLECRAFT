import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore, useToastStore, useThemeStore } from '../store/appStore';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get('/api/cart');
            setCart(res.data);
        } catch (e) {
            addToast('Failed to load cart', 'error');
        }
        setLoading(false);
    };

    const handleRemove = async (id) => {
        try {
            await axios.delete(`/api/cart/${id}`);
            setCart(cart.filter(i => i.id !== id));
            addToast('Removed from bag', 'info');
        } catch (e) {
            addToast('Failed to remove item', 'error');
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            addToast('Please sign in to checkout', 'warning');
            navigate('/auth');
            return;
        }
        if (cart.length === 0) return;
        navigate('/checkout');
    };

    const total = cart.reduce((acc, curr) => acc + Number(curr.total_price), 0);
    const bgClass = darkMode ? 'bg-[#0D0D0D] text-white' : 'bg-[#FAFAFA] text-[#111]';
    const cardBg = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';

    return (
        <div className={`min-h-screen pt-24 font-mono ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-3xl font-bold tracking-tighter uppercase mb-10">Your Bag</h1>
                
                {loading ? (
                    <div>Loading...</div>
                ) : cart.length === 0 ? (
                    <div className={`p-10 text-center border ${cardBg}`}>
                        <div className="text-4xl mb-4">🛍️</div>
                        <p className="text-sm tracking-widest uppercase mb-6 opacity-70">Your bag is empty</p>
                        <Link to="/collections" className="inline-block px-8 py-3 bg-[#E85D26] text-white text-[10px] tracking-widest uppercase hover:bg-[#D14F1E] transition-colors">
                            Explore Collections
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className={`p-5 flex justify-between border ${cardBg}`}>
                                    <div>
                                        <h3 className="font-bold tracking-wider uppercase mb-1">Custom Sneaker</h3>
                                        <p className="text-xs opacity-60 tracking-widest uppercase mb-3">Material: {item.material} | Sole: {item.sole_type}</p>
                                        <div className="flex gap-2 mb-2">
                                            {Object.entries(item.color_zones).map(([zone, color]) => (
                                                <div key={zone} className="w-4 h-4 rounded-full border border-gray-500" style={{ backgroundColor: color }} title={zone} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-between">
                                        <div className="font-bold">${Number(item.total_price).toFixed(2)}</div>
                                        <button onClick={() => handleRemove(item.id)} className="text-[10px] text-red-500 hover:underline uppercase tracking-widest">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div>
                            <div className={`p-6 border sticky top-24 ${cardBg}`}>
                                <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Summary</h2>
                                <div className="flex justify-between mb-3 text-xs tracking-wider">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-6 text-xs tracking-wider">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-500 font-bold tracking-wider mb-8">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full py-4 bg-[#E85D26] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#D14F1E] transition-colors">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
