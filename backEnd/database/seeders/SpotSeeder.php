<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Spot::factory(10)->create([
            'parc_id' => \App\Models\Parc::factory()->create()->id,
        ]);
    }
}
