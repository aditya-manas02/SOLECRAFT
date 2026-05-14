<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getOrders()
    {
        // Require admin role
        if (auth()->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $orders = Order::with(['user', 'design.shoe'])->latest()->get();
        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:placed,accepted,rejected,manufacturing,shipped,delivered',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];
        $order->save();

        return response()->json(['success' => true, 'message' => 'Order status updated successfully']);
    }
}
