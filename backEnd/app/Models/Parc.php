<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Parc extends Model
{
    /** @use HasFactory<\Database\Factories\ParcFactory> */
    use HasFactory,SoftDeletes;
  
    protected $fillable = [
        'nom',
        'capacite',
        'adresse',
    ];
    
    public function employes(){
        return $this->hasMany(Employe::class);
    }


    public function spots(){
        return $this->hasMany(Spot::class);
    }
   
    
}
