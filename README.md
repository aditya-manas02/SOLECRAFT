# 👟 SOLECRFT — Reimagined Footwear

SoleCraft is a premium e-commerce platform that allows users to design, customize, and purchase high-end footwear using a real-time 3D configurator.

## ✨ Features

- **3D Configurator**: Real-time customization of shoe zones (Toe, Heel, Sole, etc.) using Three.js.
- **Material Selection**: Choose between Premium Leather, Suede, and Technical Mesh.
- **Monogramming**: Personalize your sneakers with custom embroidery or engraving.
- **Live Tracking**: Real-time order status updates and global tracking.
- **Admin Dashboard**: Comprehensive order management and product control.
- **Secure Payments**: Integrated with Stripe and PayPal.

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Vite, TailwindCSS, Three.js
- **Database**: MySQL (XAMPP/Local)
- **State Management**: GSAP for smooth UI transitions

## 🚀 Getting Started

1. **Start XAMPP**: Ensure Apache and MySQL are running (Port 3308 recommended).
2. **Environment**: Copy `.env.example` to `.env` and configure your database.
3. **Install Dependencies**:
   ```bash
   composer install
   npm install
   ```
4. **Database Setup**:
   ```bash
   php artisan migrate --seed
   ```
5. **Run the Application**:
   ```bash
   php artisan serve
   npm run dev
   ```

## 🔐 Credentials (Demo)

- **Admin**: `admin@solecraft.com` / `password`
- **User**: `test@example.com` / `password`

---
*Designed for excellence. Built for individuals.*
