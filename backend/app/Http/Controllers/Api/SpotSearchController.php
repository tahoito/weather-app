<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SpotSearchController extends Controller
{
    public function index(Request $request)
    {
        $areaId = $request->area_id;
        $userId = auth()->id();

        $spots = Spot::query()
            ->where('area_id',$areaId)
            ->withCount([
                'favorites as is_favorited' => function ($q) use ($userId) {
                    $q->where('user_id',$userId);
                }
            ])
            ->get();
        return $spots;
    }
}
