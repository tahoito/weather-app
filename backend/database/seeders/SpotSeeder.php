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
                'detail' => '天守閣や本丸御殿が見どころ。散歩にもおすすめ。',
                'image_url' => 'https://placehold.co/300x200?text=Nagoya',
                'image_urls' => json_encode([
                    'https://placehold.co/600x400?text=Nagoya+1',
                    'https://placehold.co/600x400?text=Nagoya+2',
                ]),
                'lat' => 35.1850,
                'lon' => 136.8990, 
                'tag' => '映え',
                'is_indoor' => false,
                'weather_ok' => true,
                'price' => '大人500円',
                'opening_hours' => '9:00-16:30',
                'weather_suitability' => json_encode(['晴れ: 散歩が最高', '小雨: 傘あればOK']),
                'highlights' => json_encode(['写真映えする', '広いので歩きやすい']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ミッドランドスクエア',
                'area' => 'meieki',
                'description' => '展望台が人気。',
                'detail' => '駅直結で行きやすい。屋内なので雨の日にもおすすめ。',
                'image_url' => 'https://placehold.co/300x200?text=Midland',
                'image_urls' => json_encode([
                    'https://placehold.co/600x400?text=Midland+1',
                    'https://placehold.co/600x400?text=Midland+2',
                ]),
                'lat' => 35.1709,
                'lon' => 136.8847,
                'tag' => '映え',
                'is_indoor' => true,
                'weather_ok' => true,
                'price' => '無料（施設によって有料）',
                'opening_hours' => '10:00-20:30',
                'weather_suitability' => json_encode(['晴れ: 景色がすごく綺麗', '雨: 屋内で快適']),
                'highlights' => json_encode(['写真映えする', 'デートスポットに良い']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ノリタケの森',
                'area' => 'meieki',
                'description' => '散歩とカフェ。',
                'detail' => '緑が多くて落ち着く。ゆっくりしたい日におすすめ。',
                'image_url' => 'https://placehold.co/300x200?text=Noritake',
                'image_urls' => json_encode([
                    'https://placehold.co/600x400?text=Noritake+1',
                    'https://placehold.co/600x400?text=Noritake+2',
                ]),
                'lat' => 35.1778,
                'lon' => 136.8792,
                'tag' => 'ゆっくり',
                'is_indoor' => false,
                'weather_ok' => true,
                'price' => '無料（施設によって有料）',
                'opening_hours' => '8:00-20:30',
                'weather_suitability' => json_encode(['晴れ: 季節に触れて楽しい', '小雨: 傘あればOK']),
                'highlights' => json_encode(['写真映えする', 'ゆっくりおしゃべりできる']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KITTE名古屋',
                'area' => 'meieki',
                'description' => 'ごはんと買い物。',
                'detail' => '屋内で過ごしやすい。雨の日の選択肢として強い。',
                'image_url' => 'https://placehold.co/300x200?text=KITTE',
                'image_urls' => json_encode([
                    'https://placehold.co/600x400?text=KITTE+1',
                    'https://placehold.co/600x400?text=KITTE+2',
                ]),
                'lat' => 35.1707,
                'lon' => 136.8827,
                'tag' => 'アクティブ',
                'is_indoor' => true,
                'weather_ok' => true,
                'price' => '無料',
                'opening_hours' => '10:00-20:00',
                'weather_suitability' => json_encode(['晴れ: ついでに散歩もできる', '雨: 屋内で完結']),
                'highlights' => json_encode(['買い物が便利', 'ごはんも充実']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
