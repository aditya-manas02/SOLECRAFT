<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Material::create(['name' => 'Italian Leather', 'type' => 'leather', 'price_modifier' => 0]);
        \App\Models\Material::create(['name' => 'Premium Suede', 'type' => 'suede', 'price_modifier' => 15.00]);
        \App\Models\Material::create(['name' => 'Technical Mesh', 'type' => 'mesh', 'price_modifier' => 5.00]);
        \App\Models\Material::create(['name' => 'Classic Canvas', 'type' => 'canvas', 'price_modifier' => 0]);
    }
}
