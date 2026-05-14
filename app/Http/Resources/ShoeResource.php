<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShoeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'base_price' => $this->base_price,
            'model_file' => $this->model_file,
            'thumbnail' => $this->thumbnail,
            'available_materials' => $this->available_materials,
            'available_soles' => $this->available_soles,
        ];
    }
}
