@extends('layouts.app')

@section('title', 'SOLECRFT — Reimagined Footwear')

@section('styles')
<style>
    .hero-magazine {
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr 1fr;
        position: relative;
        overflow: hidden;
    }

    .hero-left {
        padding: 10% 8%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 2;
    }

    .hero-right {
        background: var(--bg-offset);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hero-h1 {
        font-size: clamp(6rem, 15vw, 12rem);
        line-height: 0.85;
        margin-bottom: 3rem;
        -webkit-text-stroke: 1px var(--black);
        color: transparent;
        transition: 0.5s;
    }

    .hero-h1 span {
        color: var(--black);
        -webkit-text-stroke: 0;
    }

    .floating-shoe {
        width: 120%;
        transform: rotate(-15deg) translateY(0);
        filter: drop-shadow(20px 40px 60px rgba(0,0,0,0.15));
        animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: rotate(-15deg) translateY(0); }
        50% { transform: rotate(-10deg) translateY(-40px); }
    }

    .editorial-grid {
        padding: 10rem 5%;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 2rem;
    }

    .editorial-card {
        grid-column: span 6;
        position: relative;
        overflow: hidden;
    }

    .editorial-card img {
        width: 100%;
        height: 700px;
        object-fit: cover;
        filter: grayscale(1);
        transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .editorial-card:hover img {
        filter: grayscale(0);
        transform: scale(1.05);
    }

    .section-label {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--accent);
        margin-bottom: 2rem;
        display: block;
        letter-spacing: 3px;
    }

    .feature-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4rem;
        padding: 8rem 5%;
        background: var(--black);
        color: white;
    }

    .feature-item h3 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .feature-item p {
        color: #999;
        font-size: 0.9rem;
        line-height: 1.8;
    }
</style>
@endsection

@section('content')
<!-- Hero Section -->
<section class="hero-magazine">
    <div class="hero-left animate-up">
        <span class="section-label">EST. 2024 // PREMIUM FOOTWEAR</span>
        <h1 class="hero-h1">RE<span>IMAGINED</span><br>COMFORT</h1>
        <p style="max-width: 450px; margin-bottom: 3rem; font-size: 1.1rem; line-height: 1.8;">
            Brutal aesthetics meet unparalleled engineering. Design your legacy with our state-of-the-art 3D configurator.
        </p>
        <div style="display: flex; gap: 2rem;">
            <a href="{{ route('shoes.index') }}" class="btn btn-primary">SHOP COLLECTIONS</a>
            <a href="#featured" class="btn btn-outline">EXPLORE MODELS</a>
        </div>
    </div>
    <div class="hero-right">
        <div style="position: absolute; font-family: var(--font-display); font-size: 40rem; color: #eee; z-index: 0; pointer-events: none;">SOLE</div>
        <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000" alt="Shoe" class="floating-shoe">
    </div>
</section>

<!-- Features Bar -->
<section class="feature-list">
    <div class="feature-item animate-up">
        <h3>3D DESIGN</h3>
        <p>Real-time SVG & Three.js configurator with millimetric precision.</p>
    </div>
    <div class="feature-item animate-up" style="animation-delay: 0.2s;">
        <h3>GLOBAL TRACKING</h3>
        <p>Live status updates from our craft studio to your doorstep.</p>
    </div>
    <div class="feature-item animate-up" style="animation-delay: 0.4s;">
        <h3>PREMIUM MATERIALS</h3>
        <p>Hand-picked Italian leathers and technical mesh fabrics.</p>
    </div>
</section>

<!-- Editorial Section -->
<section id="featured" class="editorial-grid">
    <div class="editorial-card animate-up">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000" alt="Sport">
        <div style="position: absolute; bottom: 4rem; left: 4rem; color: white; z-index: 2;">
            <span class="pill" style="background: var(--accent); border: none; color: white;">PERFORMANCE</span>
            <h2 style="font-size: 5rem; font-family: var(--font-display); margin-top: 1rem;">SONIC BLAZE</h2>
            <a href="{{ route('shoes.customize', 2) }}" class="btn btn-primary" style="background: white; color: black; border: none;">START DESIGNING</a>
        </div>
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>
    </div>
    <div class="editorial-card animate-up" style="margin-top: 8rem;">
        <img src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000" alt="Luxury">
        <div style="position: absolute; bottom: 4rem; left: 4rem; color: white; z-index: 2;">
            <span class="pill" style="background: white; color: black; border: none;">LUXURY</span>
            <h2 style="font-size: 5rem; font-family: var(--font-display); margin-top: 1rem;">SOVEREIGN VIII</h2>
            <a href="{{ route('shoes.customize', 3) }}" class="btn btn-primary" style="background: white; color: black; border: none;">START DESIGNING</a>
        </div>
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>
    </div>
</section>

<!-- Footer Teaser -->
<section style="padding: 15rem 5%; text-align: center; background: var(--bg-offset);">
    <h2 style="font-size: 8rem; line-height: 1; margin-bottom: 3rem;">BORN TO STAND OUT.</h2>
    <a href="{{ route('shoes.index') }}" class="btn btn-primary" style="padding: 1.5rem 5rem;">VIEW ALL MODELS</a>
</section>
@endsection
