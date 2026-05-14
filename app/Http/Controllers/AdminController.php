<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderUpdate;
use App\Models\Shoe;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Admin Dashboard with stats.
     */
    public function index()
    {
        $stats = [
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'total_users' => User::count(),
            'pending_orders' => Order::whereIn('status', ['placed', 'crafting'])->count(),
        ];

        $orders = Order::with('user')->latest()->paginate(10);
        return view('admin.dashboard', compact('stats', 'orders'));
    }

    /**
     * Update order status and notify user.
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        
        $order->update(['status' => $request->status]);

        OrderUpdate::create([
            'order_id' => $order->id,
            'status' => $request->status,
            'note' => $request->note ?? "Status changed from {$oldStatus} to {$request->status}.",
        ]);

        $this->notificationService->sendStatusUpdate($order, $request->status);

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Manage products.
     */
    public function products()
    {
        $products = Shoe::all();
        return view('admin.products', compact('products'));
    }
}
