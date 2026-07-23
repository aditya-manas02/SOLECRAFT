"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useThemeStore, useToastStore } from '../../store/appStore';
import { useConfiguratorStore } from '../../store/configuratorStore';
import axios from 'axios';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === '/';
    const isConfigurator = pathname.startsWith('/configure');
    
    const { user, isAuthenticated } = useAuthStore();
    const { darkMode, toggleDark } = useThemeStore();
    const store = useConfiguratorStore();
    const addToast = useToastStore(s => s.addToast);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            useAuthStore.getState().clearUser();
            router.push('/');
        } catch (e) {}
    };

    const handleAddCart = async () => {
        try {
            await axios.post('/api/cart/add', store.getConfig());
            addToast('Added to bag! 🛒', 'success');
            router.push('/cart');
        } catch { 
            addToast('Failed to add to bag', 'error'); 
        }
    };

    const bgClass = scrolled || !isHome
        ? darkMode
            ? 'bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#2A2A2A]'
            : 'bg-[#F5F3EF]/95 backdrop-blur-md border-b border-[#E0DED7] shadow-sm'
        : 'bg-transparent border-b border-transparent';
    const textClass = scrolled || !isHome
        ? darkMode ? 'text-white' : 'text-[#111]'
        : 'text-white';

    const navLinks = [
        { to: '/collections', label: 'Collections' },
        { to: '/configure/1', label: 'Customize', match: '/configure' },
        { to: '/gallery', label: 'Gallery' },
    ];

    // CONFIGURATOR CUSTOM NAVIGATION BAR
    if (isConfigurator) {
        return (
            <nav className="fixed top-0 w-full h-16 flex items-center justify-between px-6 md:px-8 z-50 bg-[#F5F3EF] border-b border-[#E0DED7] select-none font-mono">
                {/* Left Side: Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center relative">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#E85D26] absolute -top-0.5 -right-0.5 animate-pulse" />
                        <span className="text-[9px] font-black text-white tracking-widest">S01</span>
                    </div>
                    <span className="text-[10px] tracking-[0.4em] font-black text-[#111] uppercase hidden sm:inline">Studio Sneaker</span>
                </Link>

                {/* Center Menu: MENU, SEARCH, BAG */}
                <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.3em] text-[#111] uppercase">
                    <Link href="/collections" className="flex items-center gap-1.5 hover:text-[#E85D26] transition-colors">
                        <svg className="w-4 h-4 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                        <span className="hidden md:inline">Menu</span>
                    </Link>
                    <button className="flex items-center gap-1.5 hover:text-[#E85D26] transition-colors cursor-pointer focus:outline-none">
                        <svg className="w-4 h-4 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        <span className="hidden md:inline">Search</span>
                    </button>
                    <Link href="/cart" className="flex items-center gap-1.5 hover:text-[#E85D26] transition-colors">
                        <svg className="w-4 h-4 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        <span>Bag</span>
                    </Link>
                </div>

                {/* Right Side: CTA Button + Dynamic Price */}
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-[#111] uppercase">
                    <button 
                        onClick={handleAddCart}
                        className="px-6 py-2.5 bg-black text-white text-[9px] tracking-[0.25em] font-black rounded-full hover:bg-[#E85D26] transition-colors cursor-pointer"
                    >
                        Design Yours
                    </button>
                    <span className="hidden sm:inline font-mono font-bold text-[#333]">
                        Price: ${store.totalPrice.toFixed(0)} USD
                    </span>
                </div>
            </nav>
        );
    }

    // BASE LAYOUT NAVIGATION BAR
    return (
        <>
            <nav className={`fixed top-0 w-full h-16 flex items-center justify-between px-6 md:px-8 z-50 transition-all duration-500 ${bgClass}`}
                 role="navigation" aria-label="Main navigation">
                {/* Logo */}
                <Link href="/" className={`text-xl md:text-2xl font-bold font-mono tracking-[0.15em] transition-colors duration-300 ${textClass}`}
                      aria-label="SOLECRAFT Home">
                    SOLE<span className="text-[#E85D26]">CRAFT</span>
                </Link>

                {/* Desktop nav */}
                <div className={`hidden md:flex items-center gap-6 text-[11px] font-mono tracking-[0.3em] uppercase transition-colors duration-300 ${textClass}`}>
                    {navLinks.map(link => {
                        const active = link.match
                            ? pathname.startsWith(link.match)
                            : pathname === link.to;
                        return (
                            <Link key={link.to} href={link.to}
                                  className={`relative py-1 hover:text-[#E85D26] transition-colors group ${active ? 'text-[#E85D26]' : ''}`}>
                                {link.label}
                                <span className={`absolute bottom-0 left-0 h-px bg-[#E85D26] transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>
                        );
                    })}

                    {/* Dark mode toggle */}
                    <button onClick={toggleDark} className="p-2 hover:text-[#E85D26] transition-colors" 
                            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                        {darkMode ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                        )}
                    </button>

                    {/* Auth buttons */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link href="/cart" className="flex items-center gap-1.5 hover:text-[#E85D26] transition-colors" aria-label="Cart">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                <span>BAG</span>
                            </Link>
                            {user?.role === 'admin' && (
                                <Link href="/admin" className="hover:text-[#E85D26] transition-colors">Admin</Link>
                            )}
                            <Link href="/dashboard" className="hover:text-[#E85D26] transition-colors">Dashboard</Link>
                            <button onClick={handleLogout} className="hover:text-[#E85D26] transition-colors">Logout</button>
                            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#E85D26] flex items-center justify-center text-white text-xs font-bold"
                                  aria-label="Profile">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Link>
                        </div>
                    ) : (
                        <Link href="/auth"
                              className="px-5 py-2 bg-[#E85D26] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#D14F1E] transition-colors">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className={`md:hidden ${textClass} p-2`} onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu" aria-expanded={mobileOpen}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileOpen
                            ? <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className={`fixed inset-0 z-40 pt-16 ${darkMode ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
                    <div className="flex flex-col p-8 gap-6 text-sm font-mono tracking-[0.2em] uppercase">
                        {navLinks.map(link => (
                            <Link key={link.to} href={link.to}
                                  className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'} hover:text-[#E85D26] transition-colors`}>
                                {link.label}
                            </Link>
                        ))}
                        <button onClick={toggleDark}
                                className={`py-3 border-b text-left ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'} hover:text-[#E85D26] transition-colors`}>
                            {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        {isAuthenticated ? (
                            <>
                                <Link href="/cart" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Bag / Cart</Link>
                                {user?.role === 'admin' && (
                                    <Link href="/admin" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Admin</Link>
                                )}
                                <Link href="/dashboard" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Dashboard</Link>
                                <Link href="/profile" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Profile</Link>
                                <button onClick={handleLogout} className="py-3 text-left text-[#E85D26]">Logout</button>
                            </>
                        ) : (
                            <Link href="/auth" className="py-4 bg-[#E85D26] text-white text-center tracking-[0.3em]">Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
