<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Client;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::where('role_id', function ($query) {
            $query->select('id')
                  ->from('roles')
                  ->where('name', 'client');
        })
        ->pluck('id')
        ->toArray();

        foreach ($userIds as $userId) {
            Client::create([
                'user_id' => $userId,
            ]);
        }
    }
}
