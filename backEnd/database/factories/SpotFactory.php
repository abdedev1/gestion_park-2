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
            'nom' => $this->faker->unique()->numberBetween(1, 30),
            'status' => $this->faker->randomElement(['disponible', 'reserve']),
            'type' => $this->faker->randomElement(['voiture', 'moto', 'velo', 'handicape', 'electric']),
            'parc_id' => Parc::inRandomOrder()->value('id'),
        ];
    }
}
