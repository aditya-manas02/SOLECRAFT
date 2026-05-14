@extends('layouts.app')

@section('title', 'RETURNS & CANCELLATION // SOLECRFT')

@section('styles')
<style>
    .policy-container {
        max-width: 800px;
        margin: 10rem auto;
        padding: 0 5%;
        line-height: 2;
    }

    .policy-h1 {
        font-size: 6rem;
        font-family: var(--font-display);
        line-height: 0.9;
        margin-bottom: 5rem;
    }

    .policy-section {
        margin-bottom: 4rem;
    }

    .policy-h2 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
    }
</style>
@endsection

@section('content')
<div class="policy-container">
    <h1 class="policy-h1">RETURNS &<br>CANCELLATION</h1>

    <div class="policy-section animate-up">
        <h2 class="policy-h2">01 // CANCELLATION WINDOW</h2>
        <p>You have a <strong>24-hour grace period</strong> from the time of order placement to cancel your purchase. Since each pair is custom-crafted to your unique specifications, once production begins (after 24h), cancellation is no longer possible.</p>
    </div>

    <div class="policy-section animate-up" style="animation-delay: 0.1s;">
        <h2 class="policy-h2">02 // RETURNS POLICY</h2>
        <p>Custom designs are generally <strong>non-returnable</strong>. However, if there is a manufacturing defect or the item does not match your digital configuration, we offer a full replacement or refund. Please contact our studio within 7 days of delivery.</p>
    </div>

    <div class="policy-section animate-up" style="animation-delay: 0.2s;">
        <h2 class="policy-h2">03 // HOW TO REQUEST</h2>
        <p>Login to your <a href="{{ route('dashboard.orders') }}">Order History</a> and select "Request Return" or "Cancel Order" on the specific shipment. Our team will review your request within 48 hours.</p>
    </div>
</div>
@endsection
