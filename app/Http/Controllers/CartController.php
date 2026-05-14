<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        return response()->json($cart);
    }

    public function add(Request $request)
    {
        $cart = session()->get('cart', []);
        
        $item = [
            'id' => uniqid(),
            'shoe_id' => $request->shoe_id,
            'material' => $request->material,
            'sole_type' => $request->sole_type,
            'color_zones' => $request->color_zones,
            'monogram_text' => $request->monogram_text,
            'monogram_type' => $request->monogram_type,
            'total_price' => $request->total_price,
            'added_at' => now()->toDateTimeString()
        ];
        
        $cart[] = $item;
        session()->put('cart', $cart);

        return response()->json(['success' => true, 'message' => 'Added to cart']);
    }

    public function remove($id)
    {
        $cart = session()->get('cart', []);
        
        $cart = array_filter($cart, function($item) use ($id) {
            return $item['id'] !== $id;
        });
        
        session()->put('cart', array_values($cart));

        return response()->json(['success' => true, 'message' => 'Removed from cart']);
    }

    public function clear()
    {
        session()->forget('cart');
        return response()->json(['success' => true, 'message' => 'Cart cleared']);
    }
}
