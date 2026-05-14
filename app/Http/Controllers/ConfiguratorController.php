<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoeDesign;
use App\Http\Resources\ShoeDesignResource;

class ConfiguratorController extends Controller
{
    public function save(Request $request)
    {
        $validated = $request->validate([
            'shoe_id' => 'required|exists:shoes,id',
            'material' => 'required|string',
            'sole_type' => 'required|string',
            'color_zones' => 'required|array',
            'color_zones.Toe' => 'required|string',
            'color_zones.Sole' => 'required|string',
            'color_zones.Tongue' => 'required|string',
            'color_zones.Heel' => 'required|string',
            'color_zones.Laces' => 'required|string',
            'monogram_text' => 'nullable|string|max:3',
            'monogram_type' => 'nullable|in:embroidery,engraving',
            'total_price' => 'required|numeric'
        ]);

        $design = ShoeDesign::create([
            'user_id' => auth()->id(), // nullable if not logged in
            'shoe_id' => $validated['shoe_id'],
            'material' => $validated['material'],
            'sole_type' => $validated['sole_type'],
            'color_zones' => $validated['color_zones'],
            'monogram_text' => $validated['monogram_text'] ?? null,
            'monogram_type' => $validated['monogram_type'] ?? null,
            'total_price' => $validated['total_price'],
        ]);

        return response()->json([
            'success' => true,
            'design_id' => $design->id,
            'message' => 'Design saved!'
        ]);
    }

    public function show($id)
    {
        $design = ShoeDesign::findOrFail($id);
        return new ShoeDesignResource($design);
    }
}
