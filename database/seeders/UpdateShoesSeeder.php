<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shoe;
use Illuminate\Support\Str;

class UpdateShoesSeeder extends Seeder
{
    public function run(): void
    {
        $models = [
            ['name' => 'Classic High Sneakers', 'path' => 'black_converse/scene.gltf'],
            ['name' => 'Ray II Boots', 'path' => 'boot_for_ray_ii/scene.gltf'],
            ['name' => 'Lowpoly Sneakers', 'path' => 'cheap_nameless_sneakers_lowpoly/scene.gltf'],
            ['name' => 'Combat Boots', 'path' => 'combat_ankle_boot_-_bota/scene.gltf'],
            ['name' => 'Classic Converse', 'path' => 'converse_classic/scene.gltf'],
            ['name' => 'Run Star Hike', 'path' => 'converse_run_star_hike_bw/scene.gltf'],
            ['name' => 'Mid-Poly Cowboy', 'path' => 'cowboy_shoes_-_mid_poly/scene.gltf'],
            ['name' => 'Timeless Moccasin', 'path' => 'mocasin_timeless_piel_becerro_negro/scene.gltf'],
            ['name' => 'Sweet Piano Shoes', 'path' => 'my_sweet_piano_shoes_with_bones/scene.gltf'],
            ['name' => 'Air 720 Max', 'path' => 'nike_air_720/scene.gltf'],
            ['name' => 'Air Jordan High', 'path' => 'nike_air_jordan/scene.gltf'],
            ['name' => 'RTFKT Creator One', 'path' => 'rtfkt_creator_one/scene.gltf'],
            ['name' => 'Chromalite RTFKT', 'path' => 'rtfktchallenge_-_chromalite/scene.gltf'],
            ['name' => 'Seen Sneakers', 'path' => 'sneakers-seen/scene.gltf'],
            ['name' => 'Unbranded White', 'path' => 'unbranded_white_sneaker/scene.gltf'],
            ['name' => 'Asics Performance', 'path' => 'asics_shoe/scene.gltf'],
            ['name' => 'Classic Leather', 'path' => 'leather_shoes/scene.gltf'],
            ['name' => 'Provocative Pink', 'path' => 'provocative_pink_shoes/scene.gltf'],
            ['name' => 'Adidas Sports', 'path' => 'scanned_adidas_sports_shoe/scene.gltf'],
            ['name' => 'Generic Shoes', 'path' => 'shoes/scene.gltf'],
            ['name' => 'Test Shoes', 'path' => 'shoes_test/scene.gltf'],
            ['name' => 'Steampunk Classics', 'path' => 'steampunk_shoe/scene.gltf'],
        ];

        foreach ($models as $m) {
            Shoe::updateOrCreate(
                ['slug' => Str::slug($m['name'])],
                [
                    'name' => $m['name'],
                    'base_price' => rand(80, 250),
                    'model_file' => $m['path'],
                    'thumbnail' => '/images/placeholders/shoe.jpg',
                    'available_materials' => [
                        ['id' => 'leather', 'label' => 'Full-Grain Leather', 'price' => 0],
                        ['id' => 'suede', 'label' => 'Premium Suede', 'price' => 15],
                        ['id' => 'patent', 'label' => 'Patent Leather', 'price' => 25],
                    ],
                    'available_soles' => [
                        ['id' => 'flat', 'label' => 'Flat Sole', 'price' => 0],
                        ['id' => 'chunky', 'label' => 'Chunky Sole', 'price' => 20],
                    ],
                    'is_active' => true,
                ]
            );
        }
    }
}
