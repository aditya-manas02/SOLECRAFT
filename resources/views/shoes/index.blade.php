@extends('layouts.app')

@section('title', 'COLLECTIONS // SOLECRFT')

@section('styles')
<style>
    .editorial-header {
        padding: 8rem 5% 4rem;
        border-bottom: 2px solid var(--black);
        margin-bottom: 6rem;
    }

    .editorial-h1 {
        font-size: clamp(4rem, 10vw, 8rem);
        line-height: 0.8;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 6rem 3rem;
        padding: 0 5% 10rem;
    }

    .product-card {
        grid-column: span 4;
        text-decoration: none;
        color: var(--black);
        transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .product-card:hover {
        transform: translateY(-20px);
    }

    .product-img-wrapper {
        width: 100%;
        aspect-ratio: 4/5;
        background: var(--bg-offset);
        margin-bottom: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .product-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 1s ease;
    }

    .product-card:hover .product-img {
        transform: scale(1.1);
    }

    .category-label {
        position: absolute;
        top: 2rem;
        left: 2rem;
        font-family: var(--font-mono);
        font-size: 0.6rem;
        letter-spacing: 2px;
        background: white;
        padding: 0.5rem 1rem;
        z-index: 2;
    }

    .product-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .product-name {
        font-family: var(--font-display);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .product-desc {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
    }

    /* Asymmetric offset for magazine look */
    .product-card:nth-child(3n-1) {
        margin-top: 10rem;
    }
</style>
@endsection

@section('content')
<div class="editorial-header animate-up">
    <span class="section-label">CURATED SELECTION // 2024</span>
    <h1 class="editorial-h1">CHOOSE<br>YOUR BASE</h1>
</div>

<div class="product-grid">
    @foreach($shoes as $shoe)
    <a href="{{ route('shoes.customize', $shoe->id) }}" class="product-card animate-up">
        <div class="product-img-wrapper">
            <span class="category-label">{{ strtoupper($shoe->category->name ?? 'CORE') }}</span>
            <img src="{{ $shoe->image }}" alt="{{ $shoe->name }}" class="product-img">
            @if($shoe->is_featured)
                <span class="pill" style="position: absolute; bottom: 2rem; right: 2rem; background: var(--black); color: white; border: none;">FEATURED</span>
            @endif
        </div>
        <div class="product-info">
            <div>
                <h3 class="product-name">{{ strtoupper($shoe->name) }}</h3>
                <p class="product-desc">{{ $shoe->description }}</p>
            </div>
            <span class="price-tag" style="font-size: 1.5rem;">${{ number_format($shoe->price, 2) }}</span>
        </div>
    </a>
    @endforeach
</div>
@endsection
