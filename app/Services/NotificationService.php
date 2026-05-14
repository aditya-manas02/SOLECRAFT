<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send order confirmation email and SMS.
     */
    public function sendOrderConfirmation(Order $order)
    {
        // Simulated Email
        Log::info("EMAIL: Order Confirmation sent to {$order->customer_email} for Order #{$order->id}");
        
        // Simulated SMS
        Log::info("SMS: Order #{$order->id} confirmed for {$order->customer_name}");
    }

    /**
     * Send status update notifications.
     */
    public function sendStatusUpdate(Order $order, string $status)
    {
        Log::info("EMAIL/SMS: Status update for Order #{$order->id}: {$status}");
    }
}
