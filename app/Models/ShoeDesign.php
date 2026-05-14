<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ShoeDesign extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shoe_id',
        'design_name',
        'material',
        'sole_type',
        'color_zones',
        'monogram_text',
        'monogram_type',
        'template_name',
        'design_thumbnail',
        'is_public',
        'share_token',
        'config_json',
        'size',
        'total_price',
    ];

    protected $casts = [
        'color_zones' => 'array',
        'config_json' => 'array',
        'is_public' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($design) {
            if (empty($design->share_token)) {
                $design->share_token = Str::random(16);
            }
        });
    }

    public function shoe()
    {
        return $this->belongsTo(Shoe::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'design_id');
    }
}
