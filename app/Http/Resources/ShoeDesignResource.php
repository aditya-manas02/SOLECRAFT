<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShoeDesignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'shoe_id' => $this->shoe_id,
            'design_name' => $this->design_name,
            'material' => $this->material,
            'sole_type' => $this->sole_type,
            'color_zones' => $this->color_zones,
            'monogram_text' => $this->monogram_text,
            'monogram_type' => $this->monogram_type,
            'template_name' => $this->template_name,
            'total_price' => $this->total_price,
            'is_public' => $this->is_public,
            'share_token' => $this->share_token,
            'config_json' => $this->config_json,
            'size' => $this->size,
            'shoe' => new ShoeResource($this->whenLoaded('shoe')),
            'user' => $this->whenLoaded('user', function () {
                return ['name' => $this->user->name];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
