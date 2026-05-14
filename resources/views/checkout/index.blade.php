@extends('layouts.app')

@section('title', 'CHECKOUT // SOLECRFT')

@section('styles')
<style>
    .checkout-container {
        max-width: 1200px;
        margin: 10rem auto;
        padding: 0 5%;
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 6rem;
    }

    .checkout-h1 {
        font-size: 6rem;
        font-family: var(--font-display);
        line-height: 0.9;
        margin-bottom: 4rem;
        grid-column: span 2;
    }

    .checkout-section {
        margin-bottom: 5rem;
    }

    .input-group {
        margin-bottom: 2rem;
    }

    .input-group label {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent);
        margin-bottom: 0.8rem;
    }

    .input-field {
        width: 100%;
        padding: 1.2rem;
        border: 1px solid var(--border);
        font-family: var(--font-mono);
        outline: none;
        transition: border-color 0.3s;
    }

    .input-field:focus {
        border-color: var(--black);
    }

    .payment-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .payment-option {
        padding: 1.5rem;
        border: 1px solid var(--border);
        cursor: pointer;
        text-align: center;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        transition: 0.3s;
    }

    .payment-option.active {
        background: var(--black);
        color: white;
        border-color: var(--black);
    }
</style>
@endsection

@section('content')
<div class="checkout-container">
    <h1 class="checkout-h1">CHECKOUT</h1>

    <div class="checkout-forms">
        <form action="{{ route('checkout.confirm') }}" method="POST" id="checkout-form">
            @csrf
            <div class="checkout-section animate-up">
                <span class="section-label">01 // SHIPPING DETAILS</span>
                <div class="input-group">
                    <label>FULL NAME</label>
                    <input type="text" name="customer_name" class="input-field" required value="{{ Auth::user()->name ?? '' }}">
                </div>
                <div class="input-group">
                    <label>EMAIL ADDRESS</label>
                    <input type="email" name="customer_email" class="input-field" required value="{{ Auth::user()->email ?? '' }}">
                </div>
                <div class="input-group">
                    <label>SHIPPING ADDRESS</label>
                    <textarea name="address" class="input-field" rows="4" required placeholder="Enter your full street address, city, and zip code"></textarea>
                </div>
            </div>

            <div class="checkout-section animate-up" style="animation-delay: 0.1s;">
                <span class="section-label">02 // DELIVERY OPTION</span>
                <div class="payment-grid">
                    <div class="payment-option active" onclick="setDelivery('standard', this)">
                        <strong>STANDARD</strong><br>5-7 DAYS // FREE
                    </div>
                    <div class="payment-option" onclick="setDelivery('express', this)">
                        <strong>EXPRESS</strong><br>2-3 DAYS // +$25
                    </div>
                </div>
                <input type="hidden" name="delivery_option" id="delivery-input" value="standard">
            </div>

            <div class="checkout-section animate-up" style="animation-delay: 0.2s;">
                <span class="section-label">03 // PAYMENT METHOD</span>
                <div class="payment-grid">
                    <div class="payment-option active" onclick="setPayment('stripe', this)">STRIPE / CARD</div>
                    <div class="payment-option" onclick="setPayment('paypal', this)">PAYPAL</div>
                    <div class="payment-option" onclick="setPayment('upi', this)">UPI / QR</div>
                    <div class="payment-option" onclick="setPayment('cod', this)">CASH ON DELIVERY</div>
                </div>
                <input type="hidden" name="payment_method" id="payment-input" value="stripe">
            </div>

            <!-- Order Summary for Backend -->
            @foreach($cart as $index => $item)
            <input type="hidden" name="items[{{ $index }}][shoe_id]" value="{{ $item['shoe_id'] }}">
            <input type="hidden" name="items[{{ $index }}][price]" value="{{ $item['price'] }}">
            <input type="hidden" name="items[{{ $index }}][options]" value="{{ json_encode($item['options']) }}">
            @endforeach
            <input type="hidden" name="total" id="final-total-input" value="{{ $total * 1.08 }}">

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 2rem;">COMPLETE SECURE PURCHASE</button>
        </form>
    </div>

    <div class="summary-box animate-up" style="animation-delay: 0.3s;">
        <span class="section-label">YOUR BAG</span>
        @foreach($cart as $item)
        <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong>{{ strtoupper($item['name']) }}</strong>
                <span>${{ number_format($item['price'], 2) }}</span>
            </div>
            <p style="font-size: 0.7rem; color: #999;">
                {{ isset($item['options']['monogram']) && !empty($item['options']['monogram']) ? 'CUSTOM DESIGN' : 'COLLECTION' }} 
                @if(!empty($item['options']['monogram']))
                // MONOGRAM: {{ strtoupper($item['options']['monogram']) }}
                @endif
            </p>
        </div>
        @endforeach
        
        <div class="summary-row">
            <span>SUBTOTAL</span>
            <span>${{ number_format($total, 2) }}</span>
        </div>
        <div class="summary-row" id="delivery-row">
            <span>SHIPPING</span>
            <span>FREE</span>
        </div>
        <div class="summary-row">
            <span>TAX (EST. 8%)</span>
            <span>${{ number_format($total * 0.08, 2) }}</span>
        </div>
        <div class="total-row">
            <span>TOTAL</span>
            <span style="float: right;" id="checkout-total">${{ number_format($total * 1.08, 2) }}</span>
        </div>

        <p style="font-size: 0.7rem; color: #999; margin-top: 3rem; text-align: center;">
            🔒 SSL SECURE PAYMENT SYSTEM
        </p>
    </div>
</div>
@endsection

@section('scripts')
<script>
    const subtotal = {{ $total }};
    const taxRate = 0.08;

    function setDelivery(type, el) {
        document.querySelectorAll('.checkout-section:nth-child(2) .payment-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('delivery-input').value = type;
        
        const shipping = type === 'express' ? 25 : 0;
        document.getElementById('delivery-row').children[1].innerText = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
        
        const total = (subtotal * (1 + taxRate)) + shipping;
        document.getElementById('checkout-total').innerText = '$' + total.toFixed(2);
        document.getElementById('final-total-input').value = total;
    }

    function setPayment(method, el) {
        document.querySelectorAll('.checkout-section:nth-child(3) .payment-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('payment-input').value = method;
    }
</script>
@endsection
