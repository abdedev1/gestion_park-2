<?php

namespace Database\Factories;

use App\Models\Spot;
use App\Models\Client;
use App\Models\PricingRate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParkingTicket>
 */
class ParkingTicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'spot_id' => Spot::factory(),
            'clientName' => $this->faker->word(),
            'entry_time' => $this->faker->dateTime(),
            'exit_time' => $this->faker->optional()->dateTime(),
            'status' => $this->faker->randomElement(['active', 'completed']),
            'discount' => $this->faker->randomFloat(2, 0, 50),
            'total_price' => $this->faker->optional()->numberBetween(1, 100),
            'client_id' => Client::factory(),
        ];
    }
}
