import React from 'react';
import { useToastStore } from '../../store/appStore';

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    const bgMap = {
        success: 'bg-emerald-600',
        error: 'bg-red-600',
        warning: 'bg-amber-500',
        info: 'bg-blue-600',
    };

    const iconMap = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm" aria-live="polite">
            {toasts.map(toast => (
                <div key={toast.id}
                     className={`toast-enter ${bgMap[toast.type] || bgMap.info} text-white px-5 py-4 font-mono text-sm tracking-wider flex items-center gap-3 shadow-lg rounded-sm`}
                     role="alert">
                    <span className="text-lg font-bold">{iconMap[toast.type]}</span>
                    <span className="flex-1">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 text-lg leading-none ml-2"
                            aria-label="Dismiss notification">&times;</button>
                </div>
            ))}
        </div>
    );
}
