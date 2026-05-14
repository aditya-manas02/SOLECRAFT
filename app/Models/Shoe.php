<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shoe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'base_price',
        'model_file',
        'thumbnail',
        'available_materials',
        'available_soles',
        'is_active',
    ];

    protected $casts = [
        'available_materials' => 'array',
        'available_soles' => 'array',
        'is_active' => 'boolean',
    ];

    public function designs()
    {
        return $this->hasMany(ShoeDesign::class);
    }
}
