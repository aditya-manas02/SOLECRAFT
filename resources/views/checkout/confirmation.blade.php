@extends('layouts.app')

@section('title', 'SUCCESS // SOLECRFT')

@section('styles')
<style>
    .confirmation-container {
        max-width: 800px;
        margin: 15rem auto;
        text-align: center;
        padding: 0 5%;
    }

    .success-icon {
        font-size: 8rem;
        margin-bottom: 2rem;
        display: block;
    }

    .conf-h1 {
        font-size: 6rem;
        font-family: var(--font-display);
        line-height: 1;
        margin-bottom: 2rem;
    }

    .order-number {
        font-family: var(--font-mono);
        font-size: 1.2rem;
        color: var(--accent);
        margin-bottom: 4rem;
        display: block;
    }
</style>
@endsection

@section('content')
<div class="confirmation-container animate-up">
    <span class="success-icon">✅</span>
    <h1 class="conf-h1">ORDER<br>SUCCESSFUL</h1>
    <span class="order-number">TRACKING ID: {{ $order->tracking_number }}</span>
    
    <p style="font-size: 1.2rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 4rem;">
        Your custom pair is now in our craft queue. We've sent a confirmation email to <strong>{{ $order->customer_email }}</strong> with your invoice and tracking details.
    </p>

    <div style="display: flex; gap: 2rem; justify-content: center;">
        <a href="{{ route('order.track', $order->id) }}" class="btn btn-primary">TRACK MY ORDER</a>
        <a href="{{ route('home') }}" class="btn btn-outline">RETURN HOME</a>
    </div>
</div>
@endsection
