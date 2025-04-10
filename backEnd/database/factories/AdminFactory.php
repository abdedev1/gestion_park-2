<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
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
                             ->where('name', 'admin')
                             ->limit(1); 
            })->inRandomOrder()->value('id'),
        ];
    }
}
