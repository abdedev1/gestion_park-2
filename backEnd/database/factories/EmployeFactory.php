<?php

namespace Database\Factories;

use App\Models\Park;
use App\Models\User;
use App\Models\Employe;
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
        $userIds = Employe::pluck("user_id")->toArray();
        return [
            'user_id' => User::where('role_id', function ($query) {
                return $query->select('id')
                             ->from('roles')
                             ->where('name', 'employe')
                             ->limit(1); 
            })
            ->whereNotIn('id', $userIds)
            ->inRandomOrder()->value('id'),
            'park_id' => Park::inRandomOrder()->value('id'),
        ];
    }
}