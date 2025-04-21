<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
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
            Admin::create([
                'user_id' => $userId,
            ]);
        }
    }
}
