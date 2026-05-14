<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ColorZone extends Model
{
    protected $guarded = [];

    public function shoe()
    {
        return $this->belongsTo(Shoe::class);
    }
}
