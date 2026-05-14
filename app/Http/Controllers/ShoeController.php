<?php

namespace App\Http\Controllers;

use App\Models\Shoe;
use App\Http\Resources\ShoeResource;

class ShoeController extends Controller
{
    public function index()
    {
        $shoes = Shoe::where('is_active', true)->get();
        return ShoeResource::collection($shoes);
    }

    public function show($id)
    {
        $shoe = Shoe::where('is_active', true)->findOrFail($id);
        return new ShoeResource($shoe);
    }
}
