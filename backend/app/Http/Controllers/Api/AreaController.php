<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;

class AreaController extends Controller
{
    public function index()
    {
        return Area::query()
            ->select('id','name','slug','lat','lon')
            ->orderBy('id')
            ->get();
    }
}
