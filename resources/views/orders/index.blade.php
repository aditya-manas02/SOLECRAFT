@extends('layouts.app')

@section('title', 'My Orders - SoleCraft')

@section('content')
<div style="max-width: 1000px; margin: 0 auto;">
    <h1 style="font-size: 2.5rem; margin-bottom: 3rem;">Recent Orders</h1>

    @if($orders->isEmpty())
        <div class="card" style="text-align: center; padding: 4rem;">
            <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 2rem;">You haven't placed any orders yet.</p>
            <a href="{{ route('shoes.index') }}" class="btn btn-primary">Start Designing</a>
        </div>
    @else
        <div style="display: grid; gap: 2rem;">
            @foreach($orders as $order)
                <div class="card" style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
                    <div style="background: rgba(0,0,0,0.2); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 5rem;">
                        👟
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                            <div>
                                <h2 style="font-size: 1.5rem; margin-bottom: 0.2rem;">Order #{{ $order->id }}</h2>
                                <p style="color: var(--text-muted);">Placed on {{ $order->created_at->format('M d, Y') }}</p>
                            </div>
                            <span style="background: var(--primary); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600;">{{ strtoupper($order->status) }}</span>
                        </div>

                        <div style="margin-bottom: 1.5rem;">
                            @foreach($order->items as $item)
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>
                                        <strong>{{ $item->shoe->name }}</strong> 
                                        <span style="color: var(--text-muted); margin-left: 1rem;">
                                            {{ $item->material }} | Size {{ $item->size }}
                                        </span>
                                    </span>
                                    <div style="width: 20px; height: 20px; border-radius: 50%; background: {{ $item->color }}; border: 1px solid var(--glass-border);"></div>
                                </div>
                            @endforeach
                        </div>

                        <div style="border-top: 1px solid var(--glass-border); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="font-size: 0.9rem; color: var(--text-muted);">Total Paid</p>
                                <p style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">${{ $order->total_amount }}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-size: 0.9rem; color: var(--text-muted);">Shipping to</p>
                                <p style="font-size: 1rem;">{{ $order->customer_name }}</p>
                            </div>
                        </div>
                        <div style="margin-top: 1.5rem; text-align: right;">
                            <form action="{{ route('orders.destroy', $order->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to cancel this order?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.9rem; font-weight: 600;">Cancel Order</button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
@endsection
