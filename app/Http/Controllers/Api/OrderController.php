<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderUpdate;
use App\Models\ShoeDesign;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * POST /api/orders/place
     */
    public function place(Request $request)
    {
        $validated = $request->validate([
            'items'            => 'required|array',
            'shipping_address' => 'required|string|max:500',
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email',
            'payment_method'   => 'nullable|string',
        ]);

        $totalPrice = collect($validated['items'])->sum('total_price');

        $order = Order::create([
            'user_id'          => auth()->id(),
            'design_id'        => null,
            'status'           => 'placed',
            'total_price'      => $totalPrice,
            'shipping_address' => $validated['shipping_address'],
            'customer_name'    => $validated['customer_name'],
            'customer_email'   => $validated['customer_email'],
            'tracking_number'  => 'SC-' . strtoupper(Str::random(10)),
            'payment_status'   => 'pending',
            'payment_method'   => $validated['payment_method'] ?? 'cod',
            'size'             => null,
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id'    => $order->id,
                'shoe_id'     => $item['shoe_id'],
                'price'       => $item['total_price'],
                'material'    => $item['material'] ?? 'leather',
                'color'       => json_encode($item['color_zones']),
                'size'        => $item['size'] ?? '9',
                'config_json' => [
                    'material'      => $item['material'] ?? 'leather',
                    'sole_type'     => $item['sole_type'] ?? 'flat',
                    'color_zones'   => $item['color_zones'],
                    'monogram_text' => $item['monogram_text'] ?? null,
                    'monogram_type' => $item['monogram_type'] ?? null,
                ],
            ]);
        }

        OrderUpdate::create([
            'order_id' => $order->id,
            'status'   => 'placed',
            'note'     => 'Order placed successfully.',
        ]);

        // Clear cart in session
        session()->forget('cart');

        return response()->json([
            'success' => true,
            'data'    => [
                'order_id'        => $order->id,
                'tracking_number' => $order->tracking_number,
                'status'          => $order->status,
                'total_price'     => $order->total_price,
            ],
            'message' => 'Order placed successfully!',
            'errors'  => [],
        ], 201);
    }

    /**
     * GET /api/orders/mine
     */
    public function mine(Request $request)
    {
        $orders = Order::with(['design.shoe', 'items'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $orders->map(function ($order) {
                return [
                    'id'               => $order->id,
                    'tracking_number'  => $order->tracking_number,
                    'status'           => $order->status,
                    'total_price'      => $order->total_price,
                    'payment_status'   => $order->payment_status,
                    'shipping_address' => $order->shipping_address,
                    'size'             => $order->size,
                    'design'           => $order->design ? [
                        'id'           => $order->design->id,
                        'design_name'  => $order->design->design_name,
                        'color_zones'  => $order->design->color_zones,
                        'material'     => $order->design->material,
                        'shoe_name'    => $order->design->shoe->name ?? null,
                    ] : null,
                    'created_at'       => $order->created_at->toDateTimeString(),
                ];
            }),
            'message' => '',
            'errors'  => [],
        ]);
    }

    /**
     * GET /api/orders/{id}
     */
    public function show($id)
    {
        $order = Order::with(['design.shoe', 'items', 'updates'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $order,
            'message' => '',
            'errors'  => [],
        ]);
    }

    /**
     * POST /api/orders/{id}/cancel
     */
    public function cancel($id)
    {
        $order = Order::where('user_id', auth()->id())->findOrFail($id);

        if ($order->created_at->diffInHours(now()) > 24) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Cancellation window (24h) has passed.',
                'errors'  => [],
            ], 422);
        }

        $order->update(['status' => 'cancelled']);
        OrderUpdate::create([
            'order_id' => $order->id,
            'status'   => 'cancelled',
            'note'     => 'Order cancelled by customer.',
        ]);

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Order cancelled.',
            'errors'  => [],
        ]);
    }
}
