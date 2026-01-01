<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SpotSearchController extends Controller
{
    public function index(Request $request)
    {
        $area = $request->area;
        $date = $request->date;
        $userId = auth()->id();

        $query = Spot::query();

        if ($area){
            $query->where('area',$area);
        }

        $spots = $query
            ->withCount([
                'favorites as is_favorited' => function ($q) use ($userId) {
                    $q->where('user_id',$userId);
                }
            ])
            ->get([
                'id',
                'name',
                'area',
                'lat',
                'lon',
                'image_url',
                'tags',
                'is_indoor',
                'weather_ok'
            ]);
            
        return $spots;
    }
}
