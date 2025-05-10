<?php

namespace Database\Factories;

use App\Models\Park;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Spot>
 */
class SpotFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'P ' . $this->faker->numberBetween(1, 50),
            'status' => $this->faker->randomElement(['available', 'reserved']),
            'type' => $this->faker->randomElement(['standard', 'accessible', 'electric']),
            'park_id' => Park::inRandomOrder()->value('id'),
            'x' => $this->faker->numberBetween(0, 15),
            'y' => $this->faker->numberBetween(0, 20),
        ];
    }
}
