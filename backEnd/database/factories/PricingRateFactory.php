<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PricingRate>
 */
class PricingRateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rate_name' => $this->faker->randomElement(['Standard','Electric','Accessible']),
            'discount' => $this->faker->randomFloat(2, 5, 50),
        ];
    }
}
