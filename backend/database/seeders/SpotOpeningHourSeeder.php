<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Spot;
use App\Models\SpotOpeningHour;

class SpotOpeningHourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $spots = Spot::all();

        foreach ($spots as $spot) {
            for ($dow = 0; $dow <= 6; $dow++){
                SpotOpeningHour::create([
                    'spot_id' => $spot->id,
                    'day_of_week' => $dow,
                    'open_time' => '09:00:00',
                    'close_time' => '18:00:00', 
                ]);
            }
        }
    }
}
