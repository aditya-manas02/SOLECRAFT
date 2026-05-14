import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // trigger slide in
        requestAnimationFrame(() => setVisible(true));
        
        const t = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // wait for exit animation
        }, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return (
        <div 
            className={`fixed top-20 right-8 z-50 text-white p-4 font-mono text-sm tracking-widest uppercase flex items-center gap-4 transition-all duration-300 ${bg} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
        >
            <span>{message}</span>
            <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
        </div>
    );
}
