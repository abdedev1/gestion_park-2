<?php

namespace Database\Seeders;

use App\Models\ParkingTicket;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParkingTicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ParkingTicket::factory(10)->create();

    }
}
