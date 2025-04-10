<?php

namespace Database\Factories;

use App\Models\Parc;
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
            'client_id' => Client::factory(),
            'base_rate_id' => PricingRate::factory(),
            'duration' => $this->faker->date(),
            'parc_id' => Parc::factory(),
            'status' => $this->faker->boolean(),
        ];
    }
}
