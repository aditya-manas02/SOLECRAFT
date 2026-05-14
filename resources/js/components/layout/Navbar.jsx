import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../../store/appStore';
import axios from 'axios';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const isConfigurator = location.pathname.startsWith('/configure');
    const { user, isAuthenticated } = useAuthStore();
    const { darkMode, toggleDark } = useThemeStore();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            useAuthStore.getState().clearUser();
            navigate('/');
        } catch (e) {}
    };

    const isLight = (scrolled || !isHome) && !darkMode;
    const bgClass = scrolled || !isHome
        ? darkMode
            ? 'bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#2A2A2A]'
            : 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-sm'
        : 'bg-transparent border-b border-transparent';
    const textClass = scrolled || !isHome
        ? darkMode ? 'text-white' : 'text-[#111]'
        : 'text-white';

    const navLinks = [
        { to: '/collections', label: 'Collections' },
        { to: '/configure/1', label: 'Customize', match: '/configure' },
        { to: '/gallery', label: 'Gallery' },
    ];

    return (
        <>
            <nav className={`fixed top-0 w-full h-16 flex items-center justify-between px-6 md:px-8 z-50 transition-all duration-500 ${bgClass}`}
                 role="navigation" aria-label="Main navigation">
                {/* Logo */}
                <Link to="/" className={`text-xl md:text-2xl font-bold font-mono tracking-[0.15em] transition-colors duration-300 ${textClass}`}
                      aria-label="SOLECRAFT Home">
                    SOLE<span className="text-[#E85D26]">CRAFT</span>
                </Link>

                {/* Desktop nav */}
                <div className={`hidden md:flex items-center gap-6 text-[11px] font-mono tracking-[0.3em] uppercase transition-colors duration-300 ${textClass}`}>
                    {navLinks.map(link => {
                        const active = link.match
                            ? location.pathname.startsWith(link.match)
                            : location.pathname === link.to;
                        return (
                            <Link key={link.to} to={link.to}
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
                            <Link to="/cart" className="flex items-center gap-1.5 hover:text-[#E85D26] transition-colors" aria-label="Cart">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                <span>BAG</span>
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="hover:text-[#E85D26] transition-colors">Admin</Link>
                            )}
                            <Link to="/dashboard" className="hover:text-[#E85D26] transition-colors">Dashboard</Link>
                            <button onClick={handleLogout} className="hover:text-[#E85D26] transition-colors">Logout</button>
                            <Link to="/profile" className="w-8 h-8 rounded-full bg-[#E85D26] flex items-center justify-center text-white text-xs font-bold"
                                  aria-label="Profile">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Link>
                        </div>
                    ) : (
                        <Link to="/auth"
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
                            <Link key={link.to} to={link.to}
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
                                <Link to="/cart" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Bag / Cart</Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Admin</Link>
                                )}
                                <Link to="/dashboard" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Dashboard</Link>
                                <Link to="/profile" className={`py-3 border-b ${darkMode ? 'border-[#2A2A2A] text-white' : 'border-[#E5E5E5] text-[#111]'}`}>Profile</Link>
                                <button onClick={handleLogout} className="py-3 text-left text-[#E85D26]">Logout</button>
                            </>
                        ) : (
                            <Link to="/auth" className="py-4 bg-[#E85D26] text-white text-center tracking-[0.3em]">Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
