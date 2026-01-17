<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;
use App\Models\Favorite;

class SpotSearchController extends Controller
{
    public function index(Request $request)
    {
        dd('SpotSearchController hit');

        
        $query  = Spot::query();
        $userId = auth()->id() ?? -1;

        if ($request->filled('area')) {
            $query->where('area', $request->area);
        }

        if ($request->filled('is_indoor')) {
            $query->where('is_indoor', $request->boolean('is_indoor'));
        }

        if ($request->filled('weather_ok')) {
            $query->where('weather_ok', $request->boolean('weather_ok'));
        }

        if ($request->filled('tag')) {
            $query->whereHas('tag', $request->input('tag'));
        }

        $query->withCount([
            'favorites as is_favorited' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }
        ]);

        return $query->get([
            'id',
            'name',
            'area',
            'lat',
            'lon',
            'image_url',
            'is_indoor',
            'weather_ok',
            'tag',
        ]);
    }
}
