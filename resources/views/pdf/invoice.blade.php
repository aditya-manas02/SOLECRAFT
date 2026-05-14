<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->tracking_number }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; }
        .invoice-info { float: right; text-align: right; }
        .details { margin-bottom: 40px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th { background: #f5f5f5; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
        .table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; }
        .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="invoice-info">
            <strong>INVOICE</strong><br>
            Date: {{ $order->created_at->format('M d, Y') }}<br>
            Tracking: {{ $order->tracking_number }}
        </div>
        <div class="logo">SOLECRFT</div>
    </div>

    <div class="details">
        <strong>BILL TO:</strong><br>
        {{ $order->customer_name }}<br>
        {{ $order->customer_email }}<br>
        {{ $order->address }}
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>ITEM</th>
                <th>DESCRIPTION</th>
                <th>QTY</th>
                <th>PRICE</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->shoe->name }}</td>
                <td>SIZE: {{ $item->size }} // CUSTOM DESIGN</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->price_snapshot, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        TOTAL AMOUNT: ${{ number_format($order->total, 2) }}
    </div>

    <div class="footer">
        © 2024 SOLECRFT ENTERPRISE. ALL RIGHTS RESERVED. THANK YOU FOR YOUR TRUST.
    </div>
</body>
</html>
