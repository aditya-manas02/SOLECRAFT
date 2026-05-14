<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShoeDesignResource;
use App\Models\ShoeDesign;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DesignController extends Controller
{
    /**
     * POST /api/designs/save — Save a sneaker design
     */
    public function save(Request $request)
    {
        $validated = $request->validate([
            'shoe_id'       => 'required|exists:shoes,id',
            'design_name'   => 'nullable|string|max:100',
            'material'      => 'required|string',
            'sole_type'     => 'required|string',
            'color_zones'   => 'required|array',
            'color_zones.Toe'    => 'required|string',
            'color_zones.Sole'   => 'required|string',
            'color_zones.Tongue' => 'required|string',
            'color_zones.Heel'   => 'required|string',
            'color_zones.Laces'  => 'required|string',
            'monogram_text' => 'nullable|string|max:3',
            'monogram_type' => 'nullable|in:embroidery,engraving',
            'template_name' => 'nullable|string',
            'total_price'   => 'required|numeric|min:0',
            'is_public'     => 'nullable|boolean',
            'size'          => 'nullable|string',
            'config_json'   => 'nullable|array',
        ]);

        $design = ShoeDesign::create([
            'user_id'          => auth()->id(),
            'shoe_id'          => $validated['shoe_id'],
            'design_name'      => $validated['design_name'] ?? 'My Design',
            'material'         => $validated['material'],
            'sole_type'        => $validated['sole_type'],
            'color_zones'      => $validated['color_zones'],
            'monogram_text'    => $validated['monogram_text'] ?? null,
            'monogram_type'    => $validated['monogram_type'] ?? null,
            'template_name'    => $validated['template_name'] ?? null,
            'total_price'      => $validated['total_price'],
            'is_public'        => $validated['is_public'] ?? false,
            'size'             => $validated['size'] ?? null,
            'config_json'      => $validated['config_json'] ?? null,
            'share_token'      => Str::random(16),
        ]);

        return response()->json([
            'success'   => true,
            'data'      => new ShoeDesignResource($design->load('shoe')),
            'message'   => 'Design saved successfully!',
            'errors'    => [],
        ], 201);
    }

    /**
     * GET /api/designs/{id}
     */
    public function show($id)
    {
        $design = ShoeDesign::with('shoe')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new ShoeDesignResource($design),
            'message' => '',
            'errors'  => [],
        ]);
    }

    /**
     * GET /api/designs/shared/{token}
     */
    public function showByToken($token)
    {
        $design = ShoeDesign::with('shoe')->where('share_token', $token)->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => new ShoeDesignResource($design),
            'message' => '',
            'errors'  => [],
        ]);
    }

    /**
     * GET /api/designs/mine
     */
    public function mine(Request $request)
    {
        $designs = ShoeDesign::with('shoe')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => ShoeDesignResource::collection($designs),
            'message' => '',
            'errors'  => [],
        ]);
    }

    /**
     * GET /api/designs/gallery — Public designs
     */
    public function gallery(Request $request)
    {
        $query = ShoeDesign::with(['shoe', 'user'])
            ->where('is_public', true)
            ->latest();

        if ($request->has('material')) {
            $query->where('material', $request->material);
        }

        $designs = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data'    => ShoeDesignResource::collection($designs),
            'message' => '',
            'errors'  => [],
            'meta'    => [
                'current_page' => $designs->currentPage(),
                'last_page'    => $designs->lastPage(),
                'total'        => $designs->total(),
            ],
        ]);
    }

    /**
     * DELETE /api/designs/{id}
     */
    public function destroy($id)
    {
        $design = ShoeDesign::where('user_id', auth()->id())->findOrFail($id);
        $design->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Design deleted.',
            'errors'  => [],
        ]);
    }

    /**
     * PUT /api/designs/{id}
     */
    public function update(Request $request, $id)
    {
        $design = ShoeDesign::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'design_name' => 'nullable|string|max:100',
            'is_public'   => 'nullable|boolean',
            'material'    => 'sometimes|string',
            'sole_type'   => 'sometimes|string',
            'color_zones' => 'sometimes|array',
            'total_price' => 'sometimes|numeric',
            'size'        => 'nullable|string',
        ]);

        $design->update($validated);

        return response()->json([
            'success' => true,
            'data'    => new ShoeDesignResource($design->fresh()->load('shoe')),
            'message' => 'Design updated.',
            'errors'  => [],
        ]);
    }
}
