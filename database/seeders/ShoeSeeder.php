<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shoe;
use App\Models\User;
use App\Models\SneakerPart;
use Illuminate\Support\Facades\Hash;

class ShoeSeeder extends Seeder
{
    public function run(): void
    {
        // ── Create demo users ──
        User::firstOrCreate(
            ['email' => 'admin@solecraft.com'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@solecraft.com',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'demo@solecraft.com'],
            [
                'name'     => 'Demo User',
                'email'    => 'demo@solecraft.com',
                'password' => Hash::make('password'),
                'role'     => 'user',
            ]
        );

        // ── Materials config ──
        $materials = [
            [
                'id' => 'leather',
                'label' => 'Full-Grain Leather',
                'price' => 0,
                'roughness' => 0.4,
                'metalness' => 0.1
            ],
            [
                'id' => 'suede',
                'label' => 'Premium Suede',
                'price' => 15,
                'roughness' => 0.9,
                'metalness' => 0.0
            ],
            [
                'id' => 'mesh',
                'label' => 'Technical Mesh',
                'price' => 5,
                'roughness' => 0.3,
                'metalness' => 0.3
            ],
            [
                'id' => 'canvas',
                'label' => 'Durable Canvas',
                'price' => 0,
                'roughness' => 0.8,
                'metalness' => 0.0
            ],
            [
                'id' => 'patent',
                'label' => 'Patent Leather',
                'price' => 25,
                'roughness' => 0.1,
                'metalness' => 0.6
            ],
            [
                'id' => 'knit',
                'label' => 'Flyknit Weave',
                'price' => 10,
                'roughness' => 0.5,
                'metalness' => 0.0
            ],
        ];

        // ── Sole options ──
        $soles = [
            ['id' => 'flat',     'label' => 'Flat Sole',     'price' => 0],
            ['id' => 'chunky',   'label' => 'Chunky Sole',   'price' => 20],
            ['id' => 'runner',   'label' => 'Runner Sole',   'price' => 15],
            ['id' => 'platform', 'label' => 'Platform Sole', 'price' => 25],
            ['id' => 'waffle',   'label' => 'Waffle Sole',   'price' => 18],
        ];

        // ── Create shoes ──
        Shoe::firstOrCreate(
            ['slug' => 'sonic-blast'],
            [
                'name' => 'Sonic Blast',
                'slug' => 'sonic-blast',
                'base_price' => 165.00,
                'model_file' => 'placeholder',
                'available_materials' => $materials,
                'available_soles' => $soles,
                'is_active' => true,
            ]
        );

        Shoe::firstOrCreate(
            ['slug' => 'nexus-alpha'],
            [
                'name' => 'Nexus Alpha',
                'slug' => 'nexus-alpha',
                'base_price' => 185.00,
                'model_file' => 'placeholder',
                'available_materials' => $materials,
                'available_soles' => $soles,
                'is_active' => true,
            ]
        );

        Shoe::firstOrCreate(
            ['slug' => 'velocity-x'],
            [
                'name' => 'Velocity X',
                'slug' => 'velocity-x',
                'base_price' => 210.00,
                'model_file' => 'placeholder',
                'available_materials' => $materials,
                'available_soles' => $soles,
                'is_active' => true,
            ]
        );

        Shoe::firstOrCreate(
            ['slug' => 'retro-wave'],
            [
                'name' => 'Retro Wave',
                'slug' => 'retro-wave',
                'base_price' => 145.00,
                'model_file' => 'placeholder',
                'available_materials' => $materials,
                'available_soles' => $soles,
                'is_active' => true,
            ]
        );

        // ── Seed sneaker_parts reference data ──
        $parts = [
            ['part_name' => 'sole',   'part_type' => 'color_zone', 'material' => 'rubber',  'price_modifier' => 0],
            ['part_name' => 'upper',  'part_type' => 'color_zone', 'material' => 'leather', 'price_modifier' => 0],
            ['part_name' => 'toe',    'part_type' => 'color_zone', 'material' => 'leather', 'price_modifier' => 0],
            ['part_name' => 'tongue', 'part_type' => 'color_zone', 'material' => 'mesh',    'price_modifier' => 0],
            ['part_name' => 'heel',   'part_type' => 'color_zone', 'material' => 'leather', 'price_modifier' => 0],
            ['part_name' => 'laces',  'part_type' => 'color_zone', 'material' => 'nylon',   'price_modifier' => 0],
            ['part_name' => 'logo',   'part_type' => 'accessory',  'material' => null,       'price_modifier' => 5],
            ['part_name' => 'ankle_strap',    'part_type' => 'accessory', 'material' => 'leather', 'price_modifier' => 10],
            ['part_name' => 'reflective_strip', 'part_type' => 'accessory', 'material' => null, 'price_modifier' => 8],
        ];

        foreach ($parts as $part) {
            SneakerPart::firstOrCreate(
                ['part_name' => $part['part_name'], 'part_type' => $part['part_type']],
                $part
            );
        }
    }
}
