<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $guarded = [];

    protected $casts = [
        'config_json' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function shoe()
    {
        return $this->belongsTo(Shoe::class);
    }
}
