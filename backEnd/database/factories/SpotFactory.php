<?php

namespace Database\Factories;

use App\Models\Parc;
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
            'numero' => $this->faker->unique()->numberBetween(1, 100),
            'etat' => $this->faker->randomElement(['libre', 'occupé']),
            'parc_id' => Parc::inRandomOrder()->value('id'),
        ];
    }
}
