<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
 use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   
    public function run(): void
    {
        $tags = [
            ['name' => 'デート', 'slug' => 'date'],
            ['name' => 'カフェ', 'slug' => 'cafe'],
            ['name' => '映え', 'slug' => 'photo'],
            ['name' => 'リラックス', 'slug' => 'relax'],
            ['name' => '推し活', 'slug' => 'bias'],
            ['name' => '勉強・作業', 'slug' => 'study'],
            ['name' => '一人', 'slug' => 'alone'],
            ['name' => '放課後', 'slug' => 'after_school'],
            ['name' => 'アクティブ', 'slug' => 'active'],
            ['name' => 'ゆっくり', 'slug' => 'slow'],
            ['name' => '買い物', 'slug' => 'shopping'],
            ['name' => '食事', 'slug' => 'food'],
        ];

        Tag::upsert($tags, ['slug'], ['name']);
    }

}
