@extends('layouts.app')

@section('title', 'TRACK ORDER // ' . $order->tracking_number)

@section('styles')
<style>
    .tracking-container {
        max-width: 1000px;
        margin: 8rem auto;
        padding: 0 5%;
    }

    .tracking-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-bottom: 3rem;
        border-bottom: 2px solid var(--black);
        margin-bottom: 5rem;
    }

    .tracking-h1 {
        font-size: 5rem;
        line-height: 1;
    }

    .status-timeline {
        position: relative;
        padding: 2rem 0;
    }

    .status-timeline::before {
        content: '';
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--border);
    }

    .status-step {
        position: relative;
        padding-left: 60px;
        margin-bottom: 4rem;
    }

    .status-dot {
        position: absolute;
        left: 10px;
        top: 5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        border: 2px solid var(--border);
        z-index: 2;
    }

    .status-step.completed .status-dot {
        background: var(--black);
        border-color: var(--black);
    }

    .status-step.active .status-dot {
        background: var(--accent);
        border-color: var(--accent);
        box-shadow: 0 0 15px var(--accent);
    }

    .status-info h3 {
        font-family: var(--font-display);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .status-info p {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .order-details-card {
        background: var(--bg-offset);
        padding: 4rem;
        margin-top: 6rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
    }

    .detail-label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent);
        display: block;
        margin-bottom: 1rem;
    }
</style>
@endsection

@section('content')
<div class="tracking-container">
    <div class="tracking-header animate-up">
        <div>
            <span class="detail-label">ORDER STATUS TRACKING</span>
            <h1 class="tracking-h1">{{ strtoupper($order->status) }}</h1>
        </div>
        <div style="text-align: right;">
            <span class="detail-label">TRACKING ID</span>
            <span style="font-family: var(--font-mono); font-weight: 700;">{{ $order->tracking_number }}</span>
        </div>
    </div>

    <div class="status-timeline">
        @php
            $statuses = [
                'placed' => 'Order Placed',
                'processing' => 'Validation',
                'crafting' => 'Studio Crafting',
                'shipped' => 'Dispatched',
                'delivered' => 'Delivered'
            ];
            $foundCurrent = false;
        @endphp

        @foreach($statuses as $key => $label)
            @php
                $isCompleted = false;
                $isActive = false;
                
                // Logic to determine if status is past, current or future
                // For simplicity in demo, we check index or specific status
                if ($order->status == $key) {
                    $isActive = true;
                    $foundCurrent = true;
                } elseif (!$foundCurrent) {
                    $isCompleted = true;
                }
            @endphp
            
            <div class="status-step {{ $isCompleted ? 'completed' : '' }} {{ $isActive ? 'active' : '' }} animate-up">
                <div class="status-dot"></div>
                <div class="status-info">
                    <h3>{{ strtoupper($label) }}</h3>
                    <p>
                        @if($isActive)
                            Your order is currently at this stage. Expected completion within 48 hours.
                        @elseif($isCompleted)
                            Completed on {{ $order->updates->where('status', $key)->first()?->created_at->format('M d, Y') ?? 'Recently' }}
                        @else
                            Pending next steps.
                        @endif
                    </p>
                </div>
            </div>
        @endforeach
    </div>

    <div class="order-details-card animate-up">
        <div>
            <span class="detail-label">SHIPPING ADDRESS</span>
            <p style="font-size: 1.1rem; line-height: 1.6;">{{ $order->customer_name }}<br>{{ $order->address }}</p>
        </div>
        <div>
            <span class="detail-label">SUMMARY</span>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span>Total Amount</span>
                <span class="price-tag">${{ number_format($order->total, 2) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Payment</span>
                <span class="pill" style="font-size: 0.6rem;">{{ strtoupper($order->payment_status) }}</span>
            </div>
        </div>
    </div>
</div>
@endsection
