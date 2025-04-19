<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::all();

        foreach ($roles as $role) {
            User::factory()->create([
                'email' => strtolower($role->name) . '@example.com',
                'password' => 'password',
                'role_id' => $role->id,
            ]);
        }
        
        User::factory(10)->create();
    }
}
