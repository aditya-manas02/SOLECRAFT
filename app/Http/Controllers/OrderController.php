<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Services\PaymentService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;
    protected $paymentService;
    protected $notificationService;

    public function __construct(
        OrderService $orderService, 
        PaymentService $paymentService,
        NotificationService $notificationService
    ) {
        $this->orderService = $orderService;
        $this->paymentService = $paymentService;
        $this->notificationService = $notificationService;
    }

    /**
     * Show checkout page.
     */
    public function checkout(Request $request)
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your bag is empty.');
        }

        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        return view('checkout.index', compact('cart', 'total'));
    }

    /**
     * Confirm order and process payment.
     */
    public function confirm(Request $request)
    {
        $order = $this->orderService->placeOrder($request->all(), auth()->id());
        
        $payment = $this->paymentService->processPayment(
            $order, 
            $request->payment_method, 
            $order->total
        );

        if ($payment['success']) {
            $this->notificationService->sendOrderConfirmation($order);
            return redirect()->route('order.confirmation', $order->id);
        }

        return back()->with('error', 'Payment failed.');
    }

    /**
     * Show order confirmation page.
     */
    public function confirmation($order_id)
    {
        $order = Order::with('items.shoe')->where('user_id', auth()->id())->findOrFail($order_id);
        return view('checkout.confirmation', compact('order'));
    }

    /**
     * Generate and download PDF invoice.
     */
    public function downloadInvoice($order_id)
    {
        $order = Order::with(['items.shoe', 'user'])->findOrFail($order_id);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', compact('order'));
        return $pdf->download("invoice-{$order->tracking_number}.pdf");
    }

    /**
     * Show order history.
     */
    public function history()
    {
        $orders = Order::with('items.shoe')->where('user_id', auth()->id())->latest()->get();
        return view('dashboard.orders', compact('orders'));
    }

    /**
     * Cancel an order.
     */
    public function cancel($id)
    {
        $order = Order::where('user_id', auth()->id())->findOrFail($id);
        
        // Cancellation window check (e.g., 24h)
        if ($order->created_at->diffInHours(now()) > 24) {
            return back()->with('error', 'Cancellation window has passed.');
        }

        $order->update(['status' => 'cancelled']);
        return back()->with('success', 'Order cancelled successfully.');
    }
}
