import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore, useToastStore, useThemeStore } from '../store/appStore';

function PasswordStrength({ password }) {
    const getStrength = (pw) => {
        if (!pw) return { level: 0, label: '', cls: '' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 1) return { level: 1, label: 'Weak', cls: 'strength-weak' };
        if (score === 2) return { level: 2, label: 'Fair', cls: 'strength-fair' };
        if (score === 3) return { level: 3, label: 'Strong', cls: 'strength-strong' };
        return { level: 4, label: 'Very Strong', cls: 'strength-very-strong' };
    };
    const s = getStrength(password);
    if (!password) return null;
    return (
        <div className="mt-2">
            <div className="h-1 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
                <div className={`strength-meter ${s.cls}`} />
            </div>
            <span className="text-[10px] tracking-widest uppercase mt-1 block" style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
        </div>
    );
}

function FieldValidator({ valid, message }) {
    if (valid === null) return null;
    return (
        <span className={`text-xs ml-2 ${valid ? 'text-emerald-500' : 'text-red-500'}`}>
            {valid ? '✓' : message}
        </span>
    );
}

export default function Auth() {
    const [mode, setMode] = useState('login'); // login | register | forgot
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [name, setName] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const navigate = useNavigate();
    const { setUser, isAuthenticated } = useAuthStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated]);

    const emailValid = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : null;
    const nameValid = name ? name.length >= 2 : null;
    const pwMatch = confirmPw ? password === confirmPw : null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await axios.get('/sanctum/csrf-cookie').catch(() => {});
            const res = await axios.post('/api/auth/login', { email, password, remember });
            if (res.data.success) {
                setUser(res.data.data);
                addToast('Welcome back!', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setErrors({ general: msg });
            addToast(msg, 'error');
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPw) { setErrors({ confirmPw: 'Passwords do not match' }); return; }
        setLoading(true);
        setErrors({});
        try {
            await axios.get('/sanctum/csrf-cookie').catch(() => {});
            const res = await axios.post('/api/auth/register', {
                name, email, password, password_confirmation: confirmPw
            });
            if (res.data.success) {
                setUser(res.data.data);
                addToast('Account created!', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                setErrors(typeof data.errors === 'object' ? data.errors : { general: data.message });
            } else {
                setErrors({ general: data?.message || 'Registration failed' });
            }
            addToast(data?.message || 'Registration failed', 'error');
        }
        setLoading(false);
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/forgot-password', { email: forgotEmail });
            setForgotSent(true);
            addToast('Reset link sent!', 'success');
        } catch (err) {
            addToast('Failed to send reset link', 'error');
        }
        setLoading(false);
    };

    const inputCls = `w-full px-4 py-3.5 text-sm font-mono tracking-wider border transition-colors duration-200 focus:outline-none focus:border-[#E85D26] ${darkMode ? 'bg-[#222] border-[#333] text-white placeholder-[#555]' : 'bg-white border-[#E5E5E5] text-[#111] placeholder-[#999]'}`;

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Left side — Brand visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #111111 0%, #1A1A2E 40%, #E85D26 100%)' }}>
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
                <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse"
                     style={{ background: 'radial-gradient(circle, #E85D26, transparent)', filter: 'blur(100px)' }} />
                <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-15 animate-pulse"
                     style={{ background: 'radial-gradient(circle, #4CC9F0, transparent)', filter: 'blur(80px)', animationDelay: '2s' }} />
                <div className="relative z-10 text-center px-12">
                    <div className="text-[10px] tracking-[0.5em] text-[#E85D26] mb-6 uppercase animate-fade-in">Welcome to</div>
                    <h1 className="text-6xl xl:text-7xl font-bold text-white tracking-[0.15em] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        SOLE<span className="text-[#E85D26]">CRAFT</span>
                    </h1>
                    <p className="text-sm text-gray-400 tracking-[0.2em] uppercase max-w-sm mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Design your perfect sneaker in real-time 3D
                    </p>
                    <div className="mt-12 flex justify-center gap-8 text-gray-500 text-[10px] tracking-[0.3em] uppercase animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <span>50K+ Designs</span>
                        <span>·</span>
                        <span>6 Materials</span>
                        <span>·</span>
                        <span>∞ Colors</span>
                    </div>
                </div>
            </div>

            {/* Right side — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md animate-fade-in">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-10">
                        <h1 className="text-3xl font-bold font-mono tracking-[0.15em]" style={{ color: 'var(--color-text)' }}>
                            SOLE<span className="text-[#E85D26]">CRAFT</span>
                        </h1>
                    </div>

                    {/* Mode toggle */}
                    {mode !== 'forgot' && (
                        <div className="flex mb-10 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <button onClick={() => { setMode('login'); setErrors({}); }}
                                    className={`flex-1 pb-4 text-xs tracking-[0.3em] uppercase font-mono transition-colors border-b-2 ${mode === 'login' ? 'border-[#E85D26] text-[#E85D26]' : 'border-transparent'}`}
                                    style={mode !== 'login' ? { color: 'var(--color-text-muted)' } : {}}>
                                Sign In
                            </button>
                            <button onClick={() => { setMode('register'); setErrors({}); }}
                                    className={`flex-1 pb-4 text-xs tracking-[0.3em] uppercase font-mono transition-colors border-b-2 ${mode === 'register' ? 'border-[#E85D26] text-[#E85D26]' : 'border-transparent'}`}
                                    style={mode !== 'register' ? { color: 'var(--color-text-muted)' } : {}}>
                                Create Account
                            </button>
                        </div>
                    )}

                    {/* ── FORGOT PASSWORD ── */}
                    {mode === 'forgot' && (
                        <div>
                            <button onClick={() => setMode('login')} className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2 hover:text-[#E85D26] transition-colors"
                                    style={{ color: 'var(--color-text-muted)' }}>
                                ← Back to login
                            </button>
                            <h2 className="text-2xl font-bold tracking-wider mb-2 font-mono" style={{ color: 'var(--color-text)' }}>Reset Password</h2>
                            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Enter your email to receive a reset link.</p>
                            {forgotSent ? (
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm tracking-wider">
                                    ✓ Check your email for the reset link.
                                </div>
                            ) : (
                                <form onSubmit={handleForgot}>
                                    <input type="email" placeholder="EMAIL ADDRESS" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                                           className={inputCls} required />
                                    <button type="submit" disabled={loading}
                                            className="w-full mt-6 py-4 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase font-mono hover:bg-[#D14F1E] transition-colors disabled:opacity-50">
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ── LOGIN FORM ── */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-5">
                            {errors.general && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs tracking-wider">
                                    {errors.general}
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] tracking-[0.3em] uppercase mb-2 block font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                    Email <FieldValidator valid={emailValid} message="Invalid email" />
                                </label>
                                <input type="email" placeholder="hello@solecraft.com" value={email} onChange={e => setEmail(e.target.value)}
                                       className={inputCls} required autoComplete="email" id="login-email" />
                            </div>
                            <div>
                                <label className="text-[10px] tracking-[0.3em] uppercase mb-2 block font-mono" style={{ color: 'var(--color-text-muted)' }}>Password</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                                           onChange={e => setPassword(e.target.value)} className={inputCls} required id="login-password" />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider"
                                            style={{ color: 'var(--color-text-muted)' }} aria-label={showPw ? 'Hide password' : 'Show password'}>
                                        {showPw ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                                           className="w-4 h-4 accent-[#E85D26]" />
                                    <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>Remember me</span>
                                </label>
                                <button type="button" onClick={() => { setMode('forgot'); setErrors({}); }}
                                        className="text-[10px] tracking-widest uppercase text-[#E85D26] hover:underline">
                                    Forgot password?
                                </button>
                            </div>
                            <button type="submit" disabled={loading} id="login-submit"
                                    className="w-full py-4 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase font-mono hover:bg-[#D14F1E] transition-colors disabled:opacity-50 hover:shadow-[0_0_30px_rgba(232,93,38,0.3)]">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                            {/* Social login placeholders */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} /></div>
                                <div className="relative flex justify-center"><span className="px-4 text-[10px] tracking-widest uppercase" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>or</span></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className={`py-3 border text-xs tracking-wider uppercase font-mono flex items-center justify-center gap-2 transition-colors ${darkMode ? 'border-[#333] text-[#999] hover:border-[#555]' : 'border-[#E5E5E5] text-[#666] hover:border-[#ccc]'}`}>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    Google
                                </button>
                                <button type="button" className={`py-3 border text-xs tracking-wider uppercase font-mono flex items-center justify-center gap-2 transition-colors ${darkMode ? 'border-[#333] text-[#999] hover:border-[#555]' : 'border-[#E5E5E5] text-[#666] hover:border-[#ccc]'}`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/></svg>
                                    Apple
                                </button>
                            </div>
                            <p className="text-center text-[9px] tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                                Social login — UI preview (configure OAuth to enable)
                            </p>
                        </form>
                    )}

                    {/* ── REGISTER FORM ── */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            {errors.general && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs tracking-wider">
                                    {typeof errors.general === 'string' ? errors.general : JSON.stringify(errors.general)}
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] tracking-[0.3em] uppercase mb-2 block font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                    Full Name <FieldValidator valid={nameValid} message="Min 2 chars" />
                                </label>
                                <input type="text" placeholder="YOUR NAME" value={name} onChange={e => setName(e.target.value)}
                                       className={inputCls} required id="register-name" />
                            </div>
                            <div>
                                <label className="text-[10px] tracking-[0.3em] uppercase mb-2 block font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                    Email <FieldValidator valid={emailValid} message="Invalid email" />
                                </label>
                                <input type="email" placeholder="hello@solecraft.com" value={email} onChange={e => setEmail(e.target.value)}
                                       className={inputCls} required id="register-email" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] tracking-[0.3em] uppercase mb-2 block font-mono" style={{ color: 'var(--color-text-muted)' }}>Password</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                                           onChange={e => setPassword(e.target.value)} className={inputCls} required id="register-password" />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider"
                                            style={{ color: 'var(--color-text-muted)' }}>
                                        {showPw ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <PasswordStrength password={password} />
                            </div>
                            <div>
                                <label className="text-[10px] tracking-[0.3em] uppercase mb-2 block font-mono" style={{ color: 'var(--color-text-muted)' }}>
                                    Confirm Password <FieldValidator valid={pwMatch} message="Doesn't match" />
                                </label>
                                <input type="password" placeholder="••••••••" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                                       className={inputCls} required id="register-confirm-password" />
                            </div>
                            <button type="submit" disabled={loading} id="register-submit"
                                    className="w-full py-4 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase font-mono hover:bg-[#D14F1E] transition-colors disabled:opacity-50 hover:shadow-[0_0_30px_rgba(232,93,38,0.3)]">
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
