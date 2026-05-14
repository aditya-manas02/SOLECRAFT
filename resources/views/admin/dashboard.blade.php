@extends('layouts.app')

@section('title', 'ADMIN // CONTROL CENTER')

@section('styles')
<style>
    .admin-layout {
        padding: 5% 5% 10rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        margin-bottom: 6rem;
    }

    .stat-card {
        background: var(--bg-offset);
        padding: 2.5rem;
        border-radius: 4px;
    }

    .stat-value {
        font-family: var(--font-display);
        font-size: 4rem;
        line-height: 1;
        margin: 1rem 0;
    }

    .admin-table {
        width: 100%;
        border-collapse: collapse;
    }

    .admin-table th {
        text-align: left;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent);
        padding: 1.5rem;
        border-bottom: 2px solid var(--black);
    }

    .admin-table td {
        padding: 2rem 1.5rem;
        border-bottom: 1px solid var(--border);
        font-size: 0.9rem;
    }

    .status-badge {
        padding: 0.5rem 1rem;
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        border-radius: 50px;
    }

    .status-placed { background: #eee; color: #666; }
    .status-crafting { background: #fffbeb; color: #b45309; }
    .status-shipped { background: #eff6ff; color: #1d4ed8; }
    .status-delivered { background: #f0fdf4; color: #15803d; }
</style>
@endsection

@section('content')
<div class="admin-layout">
    <div style="margin-bottom: 5rem;">
        <span class="section-label">PLATFORM ADMINISTRATION</span>
        <h1 style="font-size: 6rem; font-family: var(--font-display);">CONTROL CENTER</h1>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
        <div class="stat-card animate-up">
            <span class="section-label">TOTAL REVENUE</span>
            <div class="stat-value">${{ number_format($stats['total_revenue'], 2) }}</div>
        </div>
        <div class="stat-card animate-up" style="animation-delay: 0.1s;">
            <span class="section-label">ORDERS</span>
            <div class="stat-value">{{ $stats['total_orders'] }}</div>
        </div>
        <div class="stat-card animate-up" style="animation-delay: 0.2s;">
            <span class="section-label">CUSTOMERS</span>
            <div class="stat-value">{{ $stats['total_users'] }}</div>
        </div>
        <div class="stat-card animate-up" style="animation-delay: 0.3s;">
            <span class="section-label">PENDING</span>
            <div class="stat-value" style="color: var(--accent);">{{ $stats['pending_orders'] }}</div>
        </div>
    </div>

    <!-- Recent Orders -->
    <div class="animate-up" style="animation-delay: 0.4s;">
        <h2 style="font-family: var(--font-display); font-size: 3rem; margin-bottom: 2rem;">ACTIVE SHIPMENTS</h2>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>TRACKING</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orders as $order)
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>
                        <strong>{{ $order->customer_name }}</strong><br>
                        <span style="font-size: 0.7rem; color: #999;">{{ $order->customer_email }}</span>
                    </td>
                    <td class="price-tag">${{ number_format($order->total, 2) }}</td>
                    <td>
                        <span class="status-badge status-{{ $order->status }}">
                            {{ strtoupper($order->status) }}
                        </span>
                    </td>
                    <td style="font-family: var(--font-mono); font-size: 0.8rem;">{{ $order->tracking_number }}</td>
                    <td>
                        <form action="{{ route('admin.orders.update', $order->id) }}" method="POST" style="display: flex; gap: 0.5rem;">
                            @csrf
                            @method('PATCH')
                            <select name="status" class="pill" style="border: 1px solid #ccc; background: white;">
                                <option value="placed" {{ $order->status == 'placed' ? 'selected' : '' }}>PLACED</option>
                                <option value="crafting" {{ $order->status == 'crafting' ? 'selected' : '' }}>CRAFTING</option>
                                <option value="shipped" {{ $order->status == 'shipped' ? 'selected' : '' }}>SHIPPED</option>
                                <option value="delivered" {{ $order->status == 'delivered' ? 'selected' : '' }}>DELIVERED</option>
                            </select>
                            <button type="submit" class="pill" style="background: var(--black); color: white; cursor: pointer;">UPDATE</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <div style="margin-top: 2rem;">
            {{ $orders->links() }}
        </div>
    </div>
</div>
@endsection
