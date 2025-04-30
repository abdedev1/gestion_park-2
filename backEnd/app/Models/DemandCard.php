<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandCard extends Model
{
    use HasFactory;

    protected $table = 'demand_cards';

    protected $fillable = [
        'user_id',
        'duration',
        'total_price',
        'park_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function park()
    {
        return $this->belongsTo(Park::class);
    }
}