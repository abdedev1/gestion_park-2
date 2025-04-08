<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeFactory> */
    use HasFactory;
    public function parc(){
        return $this->belongsTo(Parc::class);
    }
    

}
