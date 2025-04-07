<?php

namespace Database\Seeders;

use App\Models\Parc;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ParcSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       Parc::factory(4)->create();
    }
}
