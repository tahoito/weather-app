<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;


class SpotSearchController extends Controller
{
    public function index(Request $request)
    {
        $area = $request->area;
        $userId = auth()->id();

        $query = Spot::query();

        if ($area){
            $query->where('area',$area);
        }

        if ($request->filled('tags')) {
            $tags = $request->input('tags'); // tags[]=cafe&tags[]=date
            $query->whereHas('tags', function ($q) use ($tags) {
                $q->whereIn('slug', $tags);
            });
        }

        if ($userId) {
            $query->withCount([
                'favorites as is_favorited' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                }
            ]);
        } else {
            $query->selectRaw('0 as is_favorited');
        }

        if ($request->filled('is_indoor')){
            $query->where('is_indoor', $request->is_indoor);
        }

        if ($request->filled('weather-ok')){
            $query->where('weather_ok', $request->weather_ok);
        }

        $spots = $query->get([
                'id',
                'name',
                'area',
                'lat',
                'lon',
                'image_url',
                'is_indoor',
                'weather_ok'
            ]);

        return $spots;
    }
}
