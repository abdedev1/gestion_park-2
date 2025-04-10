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
            'vehicle_plate' => $this->faker->regexify('[A-Z]{2}-[0-9]{4}-[A-Z]{2}'),
            'entry_time' => $this->faker->dateTime(),
            'exit_time' => $this->faker->optional()->dateTime(),
            'status' => $this->faker->randomElement(['active', 'completed', 'cancelled']),
            'base_rate_id' => PricingRate::factory(),
            'amount_charged' => $this->faker->optional()->numberBetween(100, 1000),
            'client_id' => Client::factory(),
        ];
    }
}
