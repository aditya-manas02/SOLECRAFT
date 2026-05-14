@extends('layouts.app')

@section('title', 'MY ORDERS // SOLECRFT')

@section('styles')
<style>
    .dashboard-container {
        max-width: 1200px;
        margin: 10rem auto;
        padding: 0 5%;
    }

    .dashboard-h1 {
        font-size: 6rem;
        font-family: var(--font-display);
        line-height: 0.9;
        margin-bottom: 5rem;
    }

    .order-card {
        background: var(--bg-offset);
        padding: 3rem;
        margin-bottom: 2rem;
        display: grid;
        grid-template-columns: 100px 1fr 200px 150px;
        gap: 2rem;
        align-items: center;
    }

    .order-status {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        text-align: center;
        text-transform: uppercase;
        font-weight: 700;
    }

    .status-placed { background: #eee; color: #666; }
    .status-crafting { background: #fffbeb; color: #b45309; }
    .status-shipped { background: #eff6ff; color: #1d4ed8; }
</style>
@endsection

@section('content')
<div class="dashboard-container">
    <h1 class="dashboard-h1">MY ORDERS</h1>

    @forelse($orders as $order)
    <div class="order-card animate-up">
        <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;">#{{ $order->id }}</div>
        <div>
            <h3 style="font-family: var(--font-display); font-size: 1.8rem;">{{ $order->items->first()->shoe->name ?? 'Multiple Items' }}</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">ORDERED ON {{ $order->created_at->format('M d, Y') }}</p>
        </div>
        <div style="text-align: center;">
            <span class="order-status status-{{ $order->status }}">{{ $order->status }}</span>
        </div>
        <div style="text-align: right;">
            <div class="price-tag" style="margin-bottom: 1rem;">${{ number_format($order->total, 2) }}</div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <a href="{{ route('order.track', $order->id) }}" class="pill" style="text-decoration: none; display: block; background: var(--black); color: white;">TRACK</a>
                <a href="{{ route('order.invoice', $order->id) }}" class="pill" style="text-decoration: none; display: block;">INVOICE</a>
            </div>
        </div>
    </div>
    @empty
    <div style="text-align: center; padding: 10rem 0;">
        <p style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 2rem;">YOU HAVEN'T PLACED ANY ORDERS YET.</p>
        <a href="{{ route('shoes.index') }}" class="btn btn-primary">START SHOPPING</a>
    </div>
    @endforelse
</div>
@endsection
