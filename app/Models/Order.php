<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'design_id',
        'status',
        'total_price',
        'shipping_address',
        'customer_name',
        'customer_email',
        'tracking_number',
        'payment_status',
        'payment_method',
        'size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function updates()
    {
        return $this->hasMany(OrderUpdate::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function design()
    {
        return $this->belongsTo(ShoeDesign::class, 'design_id');
    }
}
