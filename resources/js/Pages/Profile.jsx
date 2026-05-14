import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore, useToastStore, useThemeStore } from '../store/appStore';

export default function Profile() {
    const { user, isAuthenticated, isLoading: authLoading, setUser } = useAuthStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [changingPw, setChangingPw] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { navigate('/auth'); return; }
        if (user) { setName(user.name || ''); setEmail(user.email || ''); }
    }, [user, isAuthenticated, authLoading]);

    const handleUpdate = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const res = await axios.put('/api/auth/profile', { name, email });
            if (res.data.success) { setUser(res.data.data); addToast('Profile updated!', 'success'); }
        } catch (err) { addToast(err.response?.data?.message || 'Update failed', 'error'); }
        setSaving(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPw !== confirmPw) { addToast('Passwords do not match', 'error'); return; }
        setChangingPw(true);
        try {
            const res = await axios.put('/api/auth/password', { current_password: currentPw, password: newPw, password_confirmation: confirmPw });
            if (res.data.success) { addToast('Password changed!', 'success'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
        } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
        setChangingPw(false);
    };

    const inp = `w-full px-4 py-3 text-sm font-mono tracking-wider border transition-colors focus:outline-none focus:border-[#E85D26] ${darkMode ? 'bg-[#222] border-[#333] text-white' : 'bg-white border-[#E5E5E5] text-[#111]'}`;
    const card = darkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#E5E5E5]';

    if (authLoading) return <div className="min-h-screen pt-24 px-6" style={{ backgroundColor: 'var(--color-bg)' }}><div className="skeleton h-48 max-w-2xl mx-auto" /></div>;

    return (
        <div className="min-h-screen pt-20 pb-16 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-2xl mx-auto">
                <div className="mb-10"><div className="text-[10px] tracking-[0.5em] text-[#E85D26] uppercase mb-2">Settings</div>
                    <h1 className="text-3xl font-bold tracking-wider font-mono" style={{ color: 'var(--color-text)' }}>Your Profile</h1></div>

                <div className={`p-8 border mb-8 flex items-center gap-6 ${card}`}>
                    <div className="w-20 h-20 rounded-full bg-[#E85D26] flex items-center justify-center text-white text-2xl font-bold shrink-0">{user?.name?.charAt(0)?.toUpperCase()}</div>
                    <div><h2 className="text-lg font-bold tracking-wider" style={{ color: 'var(--color-text)' }}>{user?.name}</h2>
                        <p className="text-xs tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p></div>
                </div>

                <div className={`p-8 border mb-8 ${card}`}>
                    <h3 className="text-xs tracking-[0.3em] text-[#E85D26] uppercase mb-6">Profile Details</h3>
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div><label className="text-[10px] tracking-[0.3em] uppercase mb-2 block" style={{ color: 'var(--color-text-muted)' }}>Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inp} required /></div>
                        <div><label className="text-[10px] tracking-[0.3em] uppercase mb-2 block" style={{ color: 'var(--color-text-muted)' }}>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inp} required /></div>
                        <button type="submit" disabled={saving} className="px-8 py-3 bg-[#E85D26] text-white text-xs tracking-[0.3em] uppercase hover:bg-[#D14F1E] transition-colors disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Changes'}</button>
                    </form>
                </div>

                <div className={`p-8 border ${card}`}>
                    <h3 className="text-xs tracking-[0.3em] text-[#E85D26] uppercase mb-6">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                        <div><label className="text-[10px] tracking-[0.3em] uppercase mb-2 block" style={{ color: 'var(--color-text-muted)' }}>Current Password</label>
                            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={inp} required /></div>
                        <div><label className="text-[10px] tracking-[0.3em] uppercase mb-2 block" style={{ color: 'var(--color-text-muted)' }}>New Password</label>
                            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inp} required /></div>
                        <div><label className="text-[10px] tracking-[0.3em] uppercase mb-2 block" style={{ color: 'var(--color-text-muted)' }}>Confirm</label>
                            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={inp} required /></div>
                        <button type="submit" disabled={changingPw} className="px-8 py-3 border text-xs tracking-[0.3em] uppercase hover:bg-[#E85D26] hover:text-white transition-colors disabled:opacity-50"
                                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                            {changingPw ? 'Updating...' : 'Update Password'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
