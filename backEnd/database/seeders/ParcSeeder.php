<?php

namespace Database\Seeders;

use App\Models\Parc;
use App\Models\Spot;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ParcSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Parc::factory(5)->create()->each(function ($parc) {
            $parc->spots()->createMany(
                Spot::factory(15)->make()->toArray()
            );
        });
    }
}
