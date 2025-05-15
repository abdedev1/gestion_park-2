<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingRate extends Model
{
    /** @use HasFactory<\Database\Factories\PricingRateFactory> */
    use HasFactory;
    protected $fillable = ['rate_name', 'discount', 'price', 'feature', 'recommended'];
}
