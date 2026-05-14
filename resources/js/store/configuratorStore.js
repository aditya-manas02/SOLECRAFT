import { create } from 'zustand'

const MAX_HISTORY = 20

const defaultConfig = {
  selectedMaterial: "leather",
  selectedSole: "flat",
  colorZones: {
    Toe:    "#F0F0F0",
    Sole:   "#1A1A2E",
    Tongue: "#5233C8",
    Heel:   "#E85D26",
    Laces:  "#D8D0B8"
  },
  selectedTemplate: null,
  accessories: {
    logo: true,
    ankleStrap: false,
    reflectiveStrip: false,
    speedLaces: false,
  },
  selectedSize: null,
  designName: "My Design",
}

export const useConfiguratorStore = create((set, get) => ({
  shoe: null,
  isLoading: false,
  error: null,
  
  ...defaultConfig,
  totalPrice: 0,
  
  // Undo/Redo
  history: [],
  historyIndex: -1,
  
  // Recent colors palette
  recentColors: JSON.parse(localStorage.getItem('solecraft-recent-colors') || '[]'),
  
  // Camera view
  cameraView: 'default',
  autoRotate: true,
  
  setShoe: (shoe) => set({ shoe }),
  setLoading: (bool) => set({ isLoading: bool }),
  setError: (err) => set({ error: err }),
  
  // ── Push state to history for undo/redo ──
  _pushHistory: () => {
    const s = get()
    const snapshot = {
      selectedMaterial: s.selectedMaterial,
      selectedSole: s.selectedSole,
      colorZones: { ...s.colorZones },
      selectedTemplate: s.selectedTemplate,
      accessories: { ...s.accessories },
    }
    const newHistory = s.history.slice(0, s.historyIndex + 1)
    newHistory.push(snapshot)
    if (newHistory.length > MAX_HISTORY) newHistory.shift()
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },
  
  // ── Material ──
  setMaterial: (id) => {
    get()._pushHistory()
    set({ selectedMaterial: id })
    get().calculateTotal()
  },
  
  // ── Sole ──
  setSole: (id) => {
    get()._pushHistory()
    set({ selectedSole: id })
    get().calculateTotal()
  },
  
  // ── Color zones ──
  setZoneColor: (zone, hex) => {
    get()._pushHistory()
    set((state) => ({
      colorZones: { ...state.colorZones, [zone]: hex }
    }))
    // Save to recent colors
    const recent = get().recentColors.filter(c => c !== hex)
    recent.unshift(hex)
    const trimmed = recent.slice(0, 8)
    localStorage.setItem('solecraft-recent-colors', JSON.stringify(trimmed))
    set({ recentColors: trimmed })
  },
  
  // ── Templates ──
  applyTemplate: (name) => {
    const templates = {
      "Electric Sunrise": { Toe: "#FF6B35", Sole: "#FFD166", Tongue: "#EF476F", Heel: "#06D6A0", Laces: "#FFFFFF" },
      "Midnight Shadow":  { Toe: "#1A1A2E", Sole: "#16213E", Tongue: "#0F3460", Heel: "#533483", Laces: "#E94560" },
      "Arctic White":     { Toe: "#F8F9FA", Sole: "#E9ECEF", Tongue: "#DEE2E6", Heel: "#CED4DA", Laces: "#ADB5BD" },
      "Solar Flare":      { Toe: "#F72585", Sole: "#7209B7", Tongue: "#3A0CA3", Heel: "#4CC9F0", Laces: "#FFFFFF" },
      "Forest Run":       { Toe: "#2D6A4F", Sole: "#1B4332", Tongue: "#52B788", Heel: "#95D5B2", Laces: "#D8F3DC" },
      "Urban Smoke":      { Toe: "#4A4E69", Sole: "#22223B", Tongue: "#9A8C98", Heel: "#C9ADA7", Laces: "#F2E9E4" },
      "Ocean Depths":     { Toe: "#023E8A", Sole: "#0077B6", Tongue: "#0096C7", Heel: "#00B4D8", Laces: "#90E0EF" },
      "Neon Cyber":       { Toe: "#0D0D0D", Sole: "#39FF14", Tongue: "#FF073A", Heel: "#00F0FF", Laces: "#FFFFFF" },
    }
    if (templates[name]) {
      get()._pushHistory()
      set({ colorZones: templates[name], selectedTemplate: name })
    }
  },
  
  // ── Accessories ──
  toggleAccessory: (key) => {
    get()._pushHistory()
    set((state) => ({
      accessories: { ...state.accessories, [key]: !state.accessories[key] }
    }))
    get().calculateTotal()
  },
  

  // ── Size ──
  setSize: (size) => set({ selectedSize: size }),
  
  // ── Design name ──
  setDesignName: (name) => set({ designName: name }),
  
  // ── Camera ──
  setCameraView: (view) => set({ cameraView: view }),
  setAutoRotate: (val) => set({ autoRotate: val }),
  
  // ── Undo / Redo ──
  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    set({ ...prev, historyIndex: historyIndex - 1 })
    get().calculateTotal()
  },
  
  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    set({ ...next, historyIndex: historyIndex + 1 })
    get().calculateTotal()
  },
  
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  
  // ── Randomize ──
  randomize: () => {
    get()._pushHistory()
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    // Generate a coherent palette using HSL
    const baseHue = Math.random() * 360
    const hslToHex = (h, s, l) => {
      const a2 = s * Math.min(l, 1 - l)
      const f = n => {
        const k = (n + h / 30) % 12
        const color = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }
    set({
      colorZones: {
        Toe:    hslToHex(baseHue, 0.7, 0.5),
        Sole:   hslToHex((baseHue + 30) % 360, 0.6, 0.4),
        Tongue: hslToHex((baseHue + 60) % 360, 0.8, 0.55),
        Heel:   hslToHex((baseHue + 180) % 360, 0.65, 0.5),
        Laces:  hslToHex((baseHue + 240) % 360, 0.3, 0.85),
      },
      selectedTemplate: null,
    })
  },
  
  // ── Price calculator ──
  calculateTotal: () =>
    set((state) => {
      const base = parseFloat(state.shoe?.base_price) || 0
      const matPrice = state.shoe?.available_materials?.find(m => m.id === state.selectedMaterial)?.price || 0
      const solePrice = state.shoe?.available_soles?.find(s => s.id === state.selectedSole)?.price || 0
      let accessoryPrice = 0
      if (state.accessories.logo) accessoryPrice += 5
      if (state.accessories.ankleStrap) accessoryPrice += 10
      if (state.accessories.reflectiveStrip) accessoryPrice += 8
      if (state.accessories.speedLaces) accessoryPrice += 7
      return { totalPrice: base + matPrice + solePrice + accessoryPrice }
    }),
  
  // ── Get full config for saving ──
  getConfig: () => {
    const s = get()
    return {
      shoe_id: s.shoe?.id,
      design_name: s.designName,
      material: s.selectedMaterial,
      sole_type: s.selectedSole,
      color_zones: s.colorZones,
      template_name: s.selectedTemplate,
      total_price: s.totalPrice,
      size: s.selectedSize,
      config_json: {
        accessories: s.accessories,
      },
    }
  },
  
  // ── Load config from saved design ──
  loadConfig: (design) => {
    set({
      selectedMaterial: design.material || 'leather',
      selectedSole: design.sole_type || 'flat',
      colorZones: design.color_zones || defaultConfig.colorZones,
      selectedTemplate: design.template_name || null,
      accessories: design.config_json?.accessories || defaultConfig.accessories,
      selectedSize: design.size || null,
      designName: design.design_name || 'My Design',
    })
    get().calculateTotal()
  },
  
  // ── Reset ──
  resetConfig: () => {
    set({
      ...defaultConfig,
      totalPrice: 0,
      history: [],
      historyIndex: -1,
    })
  },
}))
