<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function show($order_id)
    {
        $order = Order::with('updates')->findOrFail($order_id);
        return view('tracking.show', compact('order'));
    }

    public function status($id)
    {
        $order = Order::findOrFail($id);
        return response()->json(['status' => $order->status]);
    }
}
