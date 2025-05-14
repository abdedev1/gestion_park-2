<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;
    
    protected $fillable = ['user_id','cart_id'];
    
    protected $with = ['cart','tickets.spot.park'];

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function tickets()
    {
        return $this->hasMany(ParkingTicket::class);
    }
}
