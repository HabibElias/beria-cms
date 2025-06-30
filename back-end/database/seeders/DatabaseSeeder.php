<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Habib Elias',
            'email' => 'habibelias234@gmail.com',
            'password' => 'Ha@12312',
            'role' => 'admin'
        ]);

        $this->call(
            [
                CategorySeeder::class,
                BookSeeder::class,
            ]
        );
    }
}
