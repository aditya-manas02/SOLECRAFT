"use client";

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import ToastContainer from '../ui/ToastContainer';
import Watermark from '../ui/Watermark';
import { useAuthStore, useThemeStore } from '@/store/appStore';
import axios from 'axios';

export default function AppWrapper({ children }) {
  const initTheme = useThemeStore(s => s.initTheme);
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
    initTheme();
    // Check auth status on mount
    axios.get('/api/auth/me')
      .then(res => {
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Watermark />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      
      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0D0D0D] py-24 px-8 border-t border-white/5 font-mono">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
              <div className="col-span-2">
                  <div className="text-3xl font-bold text-white tracking-[0.2em] mb-8">
                      SOLE<span className="text-[#E85D26]">CRAFT</span>
                  </div>
                  <p className="text-gray-500 text-sm tracking-widest max-w-sm uppercase leading-relaxed">
                      Pioneering the future of digital craftsmanship through interactive 3D experiences.
                  </p>
              </div>
              <div>
                  <div className="text-[10px] tracking-[0.4em] text-white uppercase font-bold mb-8">Explore</div>
                  <ul className="space-y-4 text-xs tracking-widest text-gray-500 uppercase">
                      <li><a href="/collections" className="hover:text-[#E85D26] transition-colors">Collections</a></li>
                      <li><a href="/gallery" className="hover:text-[#E85D26] transition-colors">Gallery</a></li>
                      <li><a href="/configure/1" className="hover:text-[#E85D26] transition-colors">Customizer</a></li>
                  </ul>
              </div>
              <div>
                  <div className="text-[10px] tracking-[0.4em] text-white uppercase font-bold mb-8">Support</div>
                  <ul className="space-y-4 text-xs tracking-widest text-gray-500 uppercase">
                      <li><a href="#" className="hover:text-[#E85D26] transition-colors">Shipping</a></li>
                      <li><a href="#" className="hover:text-[#E85D26] transition-colors">Returns</a></li>
                      <li><a href="#" className="hover:text-[#E85D26] transition-colors">Privacy</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-[10px] tracking-[0.4em] text-gray-600 uppercase">
                  © 2026 SOLECRAFT. ENGINEERED BY THE FUTURE.
              </div>
              <div className="flex gap-8">
                  <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase cursor-pointer hover:text-white transition-colors">Twitter</span>
                  <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase cursor-pointer hover:text-white transition-colors">Instagram</span>
              </div>
          </div>
      </footer>
    </>
  );
}
