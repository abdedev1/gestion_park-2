<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spot extends Model
{
    /** @use HasFactory<\Database\Factories\SpotFactory> */
    use HasFactory;
    protected $fillable = [
        'nom',
        'type',
        'status',
        'parc_id',
    ];
   
    public function parc()
    {
        return $this->belongsTo(Parc::class);
    }

}
