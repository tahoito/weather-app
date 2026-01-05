<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Spot;

class SpotSeeder extends Seeder
{
    public function run(): void
    {
        Spot::insert([
            [
                'name' => '名古屋城',
                'area' => 'meieki',
                'description' => '名古屋の定番スポット。',
                'image_url' => 'https://placehold.co/300x200?text=Nagoya',
                'lat' => 35.1850,
                'long' => 136.8990,
                'tags' => '歴史,散歩',
                'tips' => '夕方が映える。',
                'is_indoor' => false,
                'weather_ok' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ミッドランドスクエア',
                'area' => 'meieki',
                'description' => '展望台が人気。',
                'image_url' => 'https://placehold.co/300x200?text=Midland',
                'lat' => 35.1709,
                'long' => 136.8847,
                'tags' => '夜景,屋内',
                'tips' => '雨の日でもOK。',
                'is_indoor' => true,
                'weather_ok' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ノリタケの森',
                'area' => 'meieki',
                'description' => '散歩とカフェ。',
                'image_url' => 'https://placehold.co/300x200?text=Noritake',
                'lat' => 35.1778,
                'long' => 136.8792,
                'tags' => 'カフェ,散歩',
                'tips' => '午前が空いてる。',
                'is_indoor' => false,
                'weather_ok' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KITTE名古屋',
                'area' => 'meieki',
                'description' => 'ごはんと買い物。',
                'image_url' => 'https://placehold.co/300x200?text=KITTE',
                'lat' => 35.1707,
                'long' => 136.8827,
                'tags' => '屋内,買い物',
                'tips' => '夜も行ける。',
                'is_indoor' => true,
                'weather_ok' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
