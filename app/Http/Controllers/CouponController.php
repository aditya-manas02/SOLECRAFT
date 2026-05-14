<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function apply(Request $request)
    {
        $coupon = Coupon::where('code', $request->code)->where('is_active', true)->first();
        
        if (!$coupon) {
            return response()->json(['success' => false, 'message' => 'Invalid coupon.']);
        }

        return response()->json([
            'success' => true,
            'discount_value' => $coupon->discount_value,
            'type' => $coupon->type
        ]);
    }
}
