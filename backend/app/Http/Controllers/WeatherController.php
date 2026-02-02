<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function current(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');

        // ここで外部API（Open-Meteo等）を叩く
        return response()->json([
            'temperature' => 12,
            'humidity' => 60,
            'windSpeed' => 3,
            'precipitation' => 20,
            'weatherCode' => 3,
        ]);
    }
}
