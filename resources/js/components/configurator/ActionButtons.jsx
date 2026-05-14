import React, { useState } from 'react';
import axios from 'axios';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useAuthStore, useToastStore, useThemeStore } from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

export default function ActionButtons() {
    const store = useConfiguratorStore();
    const { isAuthenticated } = useAuthStore();
    const addToast = useToastStore(s => s.addToast);
    const darkMode = useThemeStore(s => s.darkMode);
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [shareLink, setShareLink] = useState(null);

    const handleSave = async () => {
        if (!isAuthenticated) { addToast('Please sign in to save designs', 'warning'); navigate('/auth'); return; }
        setIsSaving(true);
        try {
            const res = await axios.post('/api/designs/save', { ...store.getConfig(), is_public: false });
            if (res.data.success) {
                addToast('Design saved! ✓', 'success');
                const token = res.data.data?.share_token;
                if (token) setShareLink(`${window.location.origin}/shared/${token}`);
            }
        } catch (err) { addToast(err.response?.data?.message || 'Save failed', 'error'); }
        setIsSaving(false);
    };

    const handleSavePublic = async () => {
        if (!isAuthenticated) { addToast('Please sign in first', 'warning'); navigate('/auth'); return; }
        setIsSaving(true);
        try {
            const res = await axios.post('/api/designs/save', { ...store.getConfig(), is_public: true });
            if (res.data.success) { addToast('Published to gallery! 🌐', 'success'); }
        } catch (err) { addToast('Publish failed', 'error'); }
        setIsSaving(false);
    };

    const handleAddCart = async () => {
        setIsAdding(true);
        try {
            await axios.post('/api/cart/add', store.getConfig());
            addToast('Added to bag! 🛒', 'success');
        } catch { addToast('Failed to add to bag', 'error'); }
        setIsAdding(false);
    };

    const copyShare = () => {
        if (shareLink) { navigator.clipboard.writeText(shareLink); addToast('Share link copied!', 'info'); }
    };

    const btnBase = "w-full py-3.5 text-[10px] tracking-[0.2em] uppercase font-mono flex justify-center items-center transition-all duration-200";

    return (
        <div className="flex flex-col gap-2.5">
            <button onClick={handleSave} disabled={isSaving}
                    className={`${btnBase} border ${darkMode ? 'border-[#333] text-white hover:bg-[#222]' : 'border-[#111] text-[#111] hover:bg-gray-50'} disabled:opacity-50`}>
                {isSaving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : 'Save Design'}
            </button>
            <button onClick={handleSavePublic} disabled={isSaving}
                    className={`${btnBase} border text-[#E85D26] border-[#E85D26] hover:bg-[#E85D26] hover:text-white disabled:opacity-50`}>
                🌐 Publish to Gallery
            </button>
            <button onClick={handleAddCart} disabled={isAdding}
                    className={`${btnBase} bg-[#111] text-white hover:bg-[#E85D26] disabled:opacity-50 dark:bg-[#E85D26] dark:hover:bg-[#D14F1E]`}>
                {isAdding ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Add to Bag'}
            </button>
            {shareLink && (
                <button onClick={copyShare} className={`${btnBase} text-[#E85D26] hover:underline`}>
                    🔗 Copy Share Link
                </button>
            )}
        </div>
    );
}
