<?php

namespace Database\Seeders;

use App\Models\Park;
use App\Models\Spot;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ParkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Park::factory(5)->create()->each(function ($park) {
            $max_spots = rand(30, 50);
            $max_columns = rand(6, 10);
            $x = 0;
            $y = 0;

            for ($i = 0; $i < $max_spots; $i++) {
                $spot = Spot::factory()->make([
                    'x' => $x,
                    'y' => $y,
                    'park_id' => $park->id,
                ]);
                $park->spots()->save($spot);

                $x++;
                if ($x >= $max_columns) {
                    $x = 0;
                    $y++;
                }
            }
        });
    }

}
