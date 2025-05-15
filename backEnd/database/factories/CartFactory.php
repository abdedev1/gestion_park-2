<?php

namespace Database\Factories;

use App\Models\Park;
use App\Models\Client;
use App\Models\PricingRate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::inRandomOrder()->value('id'),
            'base_rate_id' => PricingRate::inRandomOrder()->value('id'),
            'duration' => $this->faker->date(),
            'park_id' => Park::inRandomOrder()->value('id'),
            'status' => $this->faker->randomElement(['active', 'expired']),
        ];
    }
}
