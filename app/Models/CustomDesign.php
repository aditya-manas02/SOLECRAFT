<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomDesign extends Model
{
    protected $guarded = [];

    protected $casts = [
        'configuration' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shoe()
    {
        return $this->belongsTo(Shoe::class);
    }
}
