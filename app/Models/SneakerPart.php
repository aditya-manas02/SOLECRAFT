<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SneakerPart extends Model
{
    protected $fillable = [
        'part_name',
        'part_type',
        'material',
        'color_options',
        'price_modifier',
    ];

    protected $casts = [
        'color_options' => 'array',
    ];
}
