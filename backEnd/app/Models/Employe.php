<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;
    protected $fillable = ['user_id', 'park_id'];
    protected $with = ['park.spots'];
    protected $hidden = ['created_at', 'updated_at'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function park()
    {
        return $this->belongsTo(Park::class);
    }
}
