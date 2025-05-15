<?php

namespace Database\Seeders;

use App\Models\PricingRate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PricingRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rates = [
            ['rate_name' => 'Standard', 'discount' => 85, 'price' => 200, 'feature' => 'Discount 15%', 'recommended' => false],
            ['rate_name' => 'Premium', 'discount' => 80, 'price' => 250, 'feature' => 'Discount 20%', 'recommended' => true],
            ['rate_name' => 'VIP', 'discount' => 75, 'price' => 300, 'feature' => 'Discount 25%', 'recommended' => false],
        ];

        foreach ($rates as $rate) {
            PricingRate::create([
                'rate_name' => $rate['rate_name'],
                'discount' => $rate['discount'],
                'price' => $rate['price'],
                'feature' => $rate['feature'],
                'recommended' => $rate['recommended'],
            ]);
        }

    }
}
