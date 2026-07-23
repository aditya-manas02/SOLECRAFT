# 👟 SOLECRFT — Reimagined Footwear Studio

SoleCraft is a premium full-stack e-commerce platform that allows users to design, customize, and purchase high-end footwear in a real-time 3D studio.

---

## ✨ Features

- **3D Configurator**: Real-time customization of shoe zones (Toe, Heel, Sole, etc.) using Three.js, React Three Fiber, and Drei.
- **Material Selection**: Choose between Full-Grain Leather, Premium Suede, and Technical Mesh.
- **Monogramming**: Personalize your sneakers with custom embroidery or engraving.
- **Order Tracking**: Real-time order status updates and status dashboards.
- **Admin Dashboard**: Comprehensive order management control center for accepting/rejecting and manufacturing orders.
- **Theme Support**: Seamless Dark Mode & Light Mode support.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Frontend Engine**: React Three Fiber, Three.js, Zustand (State Management)
- **Styling**: TailwindCSS v4, PostCSS
- **Database**: SQLite (Self-contained, Zero-Configuration)
- **Authentication**: HTTP-Only Cookie Session Store

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Database Initialization
Setting up and seeding the self-contained SQLite database (`solecraft.db`):
```bash
npm run db:setup
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials (Demo)

- **Admin**: `admin@solecraft.com` / `password`
- **User**: `demo@solecraft.com` / `password`
- **Alternative User**: `test@example.com` / `password`

---
*Designed for excellence. Built for individuals.*
