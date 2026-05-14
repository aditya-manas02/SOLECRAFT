@extends('layouts.app')

@section('title', 'YOUR BAG // SOLECRFT')

@section('styles')
<style>
    .cart-container {
        max-width: 1200px;
        margin: 10rem auto;
        padding: 0 5%;
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 6rem;
    }

    .cart-h1 {
        font-size: 6rem;
        font-family: var(--font-display);
        line-height: 0.9;
        margin-bottom: 4rem;
        grid-column: span 2;
    }

    .cart-item {
        display: grid;
        grid-template-columns: 150px 1fr 100px;
        gap: 2rem;
        padding: 3rem 0;
        border-bottom: 1px solid var(--border);
    }

    .cart-item-img {
        width: 150px;
        aspect-ratio: 1;
        background: var(--bg-offset);
        object-fit: cover;
    }

    .item-details h3 {
        font-family: var(--font-display);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .item-meta {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 1rem;
    }

    .summary-box {
        background: var(--bg-offset);
        padding: 3rem;
        height: fit-content;
        position: sticky;
        top: 120px;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        font-family: var(--font-mono);
        font-size: 0.85rem;
    }

    .total-row {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border);
        font-family: var(--font-display);
        font-size: 2.5rem;
    }
</style>
@endsection

@section('content')
<div class="cart-container">
    <h1 class="cart-h1">YOUR BAG</h1>

    <div class="cart-items">
        @forelse($cart as $item)
        <div class="cart-item animate-up">
            <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" class="cart-item-img">
            <div class="item-details">
                <span class="pill" style="font-size: 0.6rem; margin-bottom: 1rem;">
                    {{ isset($item['options']['monogram']) && !empty($item['options']['monogram']) ? 'CUSTOM DESIGN' : 'COLLECTION' }}
                </span>
                <h3>{{ strtoupper($item['name']) }}</h3>
                <p class="item-meta">
                    @if(isset($item['options']))
                        MATERIAL: {{ strtoupper($item['options']['material_id'] ?? 'standard') }} // 
                        SOLE: {{ strtoupper($item['options']['sole_option'] ?? 'flat') }}
                        @if(!empty($item['options']['monogram']))
                            // MONOGRAM: {{ strtoupper($item['options']['monogram']) }}
                        @endif
                    @else
                        STANDARD EDITION
                    @endif
                </p>
                <div style="display: flex; gap: 1rem;">
                    <form action="{{ route('cart.destroy', $item['id']) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="pill" style="cursor: pointer; border: none;">REMOVE</button>
                    </form>
                    @if(isset($item['options']))
                    <a href="{{ route('shoes.customize', $item['shoe_id']) }}" class="pill" style="text-decoration: none; color: inherit;">EDIT DESIGN</a>
                    @endif
                </div>
            </div>
            <div class="price-tag" style="text-align: right; font-size: 1.2rem;">${{ number_format($item['price'], 2) }}</div>
        </div>
        @empty
        <div style="padding: 10rem 0; text-align: center; grid-column: span 2;">
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">YOUR BAG IS EMPTY</h2>
            <a href="{{ route('shoes.index') }}" class="btn btn-primary">GO SHOPPING</a>
        </div>
        @endforelse
    </div>

    @if(count($cart) > 0)
    <div class="summary-box animate-up" style="animation-delay: 0.2s;">
        <span class="section-label">ORDER SUMMARY</span>
        
        <div class="summary-row">
            <span>SUBTOTAL</span>
            <span>${{ number_format($total, 2) }}</span>
        </div>
        <div class="summary-row">
            <span>SHIPPING</span>
            <span>FREE</span>
        </div>
        <div class="summary-row">
            <span>TAX (EST. 8%)</span>
            <span>${{ number_format($total * 0.08, 2) }}</span>
        </div>

        <div style="margin-top: 3rem;">
            <input type="text" placeholder="PROMO CODE" class="btn btn-outline" style="width: 100%; text-align: left; margin-bottom: 1rem; padding: 1rem;">
            <button class="btn btn-primary" style="width: 100%;">APPLY</button>
        </div>

        <div class="total-row">
            <span>TOTAL</span>
            <span style="float: right;">${{ number_format($total * 1.08, 2) }}</span>
        </div>

        <a href="{{ route('checkout') }}" class="btn btn-primary" style="width: 100%; margin-top: 3rem; text-align: center;">PROCEED TO CHECKOUT</a>
    </div>
    @endif
</div>
@endsection
