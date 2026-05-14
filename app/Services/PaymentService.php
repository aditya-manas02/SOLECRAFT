<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Process payment based on selected gateway.
     */
    public function processPayment(Order $order, string $gateway, float $amount): array
    {
        // Simulate external API call
        $transactionId = strtoupper($gateway[0]) . '-' . Str::random(12);
        
        $payment = Payment::create([
            'order_id' => $order->id,
            'gateway' => $gateway,
            'transaction_id' => $transactionId,
            'status' => ($gateway === 'COD') ? 'pending' : 'completed',
            'amount' => $amount,
        ]);

        if ($payment->status === 'completed') {
            $order->update(['payment_status' => 'paid']);
        }

        return [
            'success' => true,
            'transaction_id' => $transactionId,
            'status' => $payment->status
        ];
    }
}
