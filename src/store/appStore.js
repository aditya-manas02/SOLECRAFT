import { create } from 'zustand'

// ── Auth Store ──
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (bool) => set({ isLoading: bool }),
}))

// ── Theme Store ──
export const useThemeStore = create((set) => ({
  darkMode: typeof window !== 'undefined' ? localStorage.getItem('solecraft-dark') === 'true' : false,
  toggleDark: () => set((s) => {
    const next = !s.darkMode
    if (typeof window !== 'undefined') {
      localStorage.setItem('solecraft-dark', next)
      document.documentElement.classList.toggle('dark', next)
    }
    return { darkMode: next }
  }),
  initTheme: () => set((s) => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', s.darkMode)
    }
    return {}
  }),
}))

// ── Toast Store ──
export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now() + Math.random()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
