<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spot extends Model
{
    /** @use HasFactory<\Database\Factories\SpotFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
        'status',
        'x',
        'y',
        'park_id',
    ];
   
    public function park()
    {
        return $this->belongsTo(Park::class);
    }

}
