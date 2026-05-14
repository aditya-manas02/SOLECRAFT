<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return view('checkout.payment');
    }

    public function stripeWebhook(Request $request)
    {
        return response()->json(['status' => 'success']);
    }

    public function paypalWebhook(Request $request)
    {
        return response()->json(['status' => 'success']);
    }
}
