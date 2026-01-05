<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            ['name' => '名駅',     'slug' => 'nagoya-station', 'lat' => 35.1709, 'lon' => 136.8815],
            ['name' => '大須',     'slug' => 'osu',            'lat' => 35.1595, 'lon' => 136.9056],
            ['name' => '金山',     'slug' => 'kanayama',       'lat' => 35.1429, 'lon' => 136.9016],
            ['name' => '栄',       'slug' => 'sakae',          'lat' => 35.1682, 'lon' => 136.9066],
            ['name' => '伏見',     'slug' => 'fushimi',        'lat' => 35.1660, 'lon' => 136.8982],
            ['name' => '矢場町',   'slug' => 'yabacho',        'lat' => 35.1601, 'lon' => 136.9067],
            ['name' => '上前津',   'slug' => 'kamimaezu',      'lat' => 35.1578, 'lon' => 136.9061],
            ['name' => '鶴舞',     'slug' => 'tsurumai',       'lat' => 35.1572, 'lon' => 136.9170],
            ['name' => '星ヶ丘',   'slug' => 'hoshigaoka',     'lat' => 35.1636, 'lon' => 136.9850],
            ['name' => '八事',     'slug' => 'yagoto',         'lat' => 35.1536, 'lon' => 136.9634],
            ['name' => '桜山',     'slug' => 'sakurayama',     'lat' => 35.1405, 'lon' => 136.9361],
            ['name' => '今池',     'slug' => 'imaike',         'lat' => 35.1685, 'lon' => 136.9364],
            ['name' => '覚王山',   'slug' => 'kakuozan',       'lat' => 35.1656, 'lon' => 136.9469],
            ['name' => '本山',     'slug' => 'motoyama',       'lat' => 35.1643, 'lon' => 136.9590],
            ['name' => '新瑞橋',   'slug' => 'aratamabashi',   'lat' => 35.1285, 'lon' => 136.9365],
            ['name' => '久屋大通', 'slug' => 'hisayaodori',    'lat' => 35.1715, 'lon' => 136.9087],
        ];

        foreach ($areas as $area) {
            Area::updateOrCreate(
                ['slug' => $area['slug']],
                $area
            );
        }
    }
}