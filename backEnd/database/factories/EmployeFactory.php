<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Parc;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        
        return [
            'user_id' => User::where('role_id', function ($query) {
                return $query->select('id')
                             ->from('roles')
                             ->where('name', 'employe')
                             ->limit(1); 
            })->inRandomOrder()->value('id'),
            'parc_id' => Parc::factory(), 
        ];
    }
}