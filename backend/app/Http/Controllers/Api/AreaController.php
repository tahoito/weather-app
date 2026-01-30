<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;

class AreaController extends Controller
{
    public function index()
    {
        $areas = Area::query()
            ->select('id','name','slug','lat','lon')
            ->orderBy('id')
            ->get();

        return response()->json($areas, 200, [], JSON_UNESCAPED_UNICODE);
    }
}
