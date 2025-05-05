<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    protected $fillable = ['user_id','cart_id'];
    use HasFactory;

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
}
