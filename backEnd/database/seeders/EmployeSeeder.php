<?php

namespace Database\Seeders;

use App\Models\Parc;
use App\Models\User;
use App\Models\Employe;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class EmployeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::where('role_id', function ($query) {
            $query->select('id')
                  ->from('roles')
                  ->where('name', 'employe');
        })
        ->pluck('id')
        ->toArray();

        foreach ($userIds as $userId) {
            Employe::create([
                'user_id' => $userId,
                'parc_id' => Parc::inRandomOrder()->value('id'),
            ]);
        }
    }
}
