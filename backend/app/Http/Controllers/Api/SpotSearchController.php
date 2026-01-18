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
        $query  = Spot::query();
        $userId = auth()->id() ?? -1;

        if ($request->filled('query')) {
            $q = $request->input('query');
            $query->where(function($w) use ($q) {
                $w->where('name','like',"%{$q}%")
                    ->orWhere('description','like',"%{$q}%");
            });
        }

        if ($request->filled('area')) {
            $areas = $request->input('area');
            $areas = is_array($areas) ? $areas : [$areas];
            $query->whereIn('area', $areas);
        }

        if ($request->filled('is_indoor')) {
            $query->where('is_indoor', (int) $request->input('is_indoor'));
        }

        if ($request->filled('weather_ok')) {
            $query->where('weather_ok', $request->boolean('weather_ok'));
        }

        if ($request->filled('tag')) {
            $tag = $request->string('tag')->toString();
            $query->where('tag', $tag);
        }

        if ($request->filled('date') && ($request->filled('start_time') || $request->filled('end_time'))) {
            $date  = $request->input('date');
            $start = $request->input('start_time');
            $end   = $request->input('end_time');
            $dow   = (int) date('w', strtotime($date));

            $query->whereHas('openingHours', function ($q) use ($dow, $start, $end) {
                $q->where('day_of_week', $dow);

                if ($start) $q->where('open_time', '<=', $start);
                if ($end)   $q->where('close_time', '>=', $end);
            });
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
