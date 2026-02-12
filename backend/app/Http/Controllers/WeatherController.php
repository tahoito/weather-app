<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function current(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');

        $res = Http::withHeaders([
            'X-API-Key' => env('WEATHER_API_KEY'),
        ])->get('https://wxtech.weathernews.com/api/v1/ss1wx', [
            'lat' => $lat,
            'lon' => $lon,
        ]);

        if (!$res->successful()) {
            return response()->json([
                'message' => 'Weathernews API error',
                'status' => $res->status(),
                'body' => $res->body(),
            ], 500);
        }

        $data = $res->json();
        $wx0 = $data['wxdata'][0] ?? null;
        $current = $wx0['srf'][0] ?? null;

        if (!$current) {
            return response()->json(['message' => 'Weather data missing'], 500);
        }

        $todayPop = $wx0['mrf'][0]['pop'] ?? 0;

        $rainyCodes = [300, 650, 850];
        $todayIso = $current['date'] ?? null;
        $today = is_string($todayIso) ? substr($todayIso, 0, 10) : null;
        $isRainyDay = false;

        if ($today && isset($wx0['srf']) && is_array($wx0['srf'])) {
            foreach ($wx0['srf'] as $item) {
                $itemIso = $item['date'] ?? null;
                $itemDate = is_string($itemIso) ? substr($itemIso, 0, 10) : null;
                if ($itemDate !== $today) {
                    continue;
                }

                $code = (int)($item['wx'] ?? 0);
                if (in_array($code, $rainyCodes, true)) {
                    $isRainyDay = true;
                    break;
                }
            }
        }

        return response()->json([
            'precipitation' => is_numeric($todayPop) ? (int)$todayPop : 0,
            'humidity'      => (int)($current['rhum'] ?? 0),
            'windSpeed'     => (float)($current['wndspd'] ?? 0),
            'temperature'   => (float)($current['temp'] ?? 0),
            'weatherCode'   => (int)($current['wx'] ?? 0),
            'isRainyDay'    => $isRainyDay,
        ]);
    }
}
