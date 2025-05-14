<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandCard extends Model
{
    use HasFactory;

    protected $table = 'demand_cards';

    protected $fillable = [
        'client_id',
        'duration',
        'total_price',
        'park_id',
        'base_rate_id',
        'status'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function park()
    {
        return $this->belongsTo(Park::class);
    }
    
}