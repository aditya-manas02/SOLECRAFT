<?php
namespace App\Services;
use App\Models\{Order, OrderItem, OrderUpdate, CustomDesign};
use Illuminate\Support\Facades\{DB, Str};

class OrderService {
    public function placeOrder(array $data, int $userId) {
        $order = DB::transaction(function () use ($data, $userId) {
            $order = Order::create([
                'user_id' => $userId,
                'status' => 'placed',
                'total_amount' => $data['total'], // Changed to match migration
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'address' => $data['address'],
                'tracking_number' => 'SC-' . strtoupper(Str::random(10))
            ]);

            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'shoe_id' => $item['shoe_id'],
                    'price' => $item['price'],
                    'color' => 'Custom', // From configuration if needed
                    'material' => 'Custom',
                    'size' => 42, // Default or from item
                ]);
            }

            OrderUpdate::create(['order_id' => $order->id, 'status' => 'placed', 'note' => 'Order placed successfully.']);
            
            session()->forget('cart');

            return $order;
        });
        
        return $order;
    }
}
