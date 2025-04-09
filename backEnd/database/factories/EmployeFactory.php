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
            'user_id' => User::factory(),
            'parc_id' => Parc::factory(), 
        ];
    }
}