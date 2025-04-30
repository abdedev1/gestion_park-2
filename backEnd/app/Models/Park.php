<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Park extends Model
{
    /** @use HasFactory<\Database\Factories\ParkFactory> */
    use HasFactory, SoftDeletes;
  
    protected $fillable = [
        'name',
        'price',
        'address',
    ];
    
    public function employees(){
        return $this->hasMany(Employe::class);
    }

    public function spots(){
        return $this->hasMany(Spot::class);
    }
}

