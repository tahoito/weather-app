<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SpotResource;
use Illuminate\Http\Request;
use App\Models\Spot;

class SpotController extends Controller
{

    public function index(Request $request)
    {
        $validated = $request->validate([
            'area' => ['nullable','string'],
            'is_indoor' => ['nullable'],
            'weather_ok' => ['nullable'],
        ]);

        $q = Spot::query()->with(['area','tags']);

        if (!empty($validated['area'])) {
            $q->where('area', $validated['area']);
        }

        if ($request->filled('is_indoor')){
            $q->where('is_indoor',filter_var($request->input('is_indoor'),  FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('weather_ok')){
            $q->where('weather_ok',filter_var($request->input('weather_ok'),FILTER_VALIDATE_BOOLEAN));
        }

        $spots = $q->select(['id','name','lat','lon','area','description','image_url','is_indoor','weather_ok'])
            ->whereNotNull('lat')
            ->whereNotNull('lon')
            ->orderBy('id')
            ->get();

        return SpotResource::collection($spots);
    }

    public function show(Spot $spot)
    {
        return new SpotResource($spot);
    }

    public function inBounds(Request $request)
    {
        $south = (float) $request->query('south');
        $west = (float) $request->query('west');
        $north = (float) $request->query('north');
        $east = (float) $request->query('east');

        $q = Spot::query()
            ->select(['id','name','lat','lon','area'])
            ->whereBetween('lat',[$south, $north])
            ->whereBetween('lon',[$west, $east])
            ->whereNotNull('lat')
            ->whereNotNull('lon');
        
        if ($request->filled('area')) {
            $q->where('area', $request->string('area'));
        }

        if ($request->filled('is_indoor')) {
            $q->where('is_indoor', filter_var($request->input('is_indoor'), FILTER_VALIDATE_BOOLEAN));
        }
        return SpotResource::collection($q->orderBy('id')->get());
    }

    public function recommended(Request $request)
    {
        $area = $request->query('area'); 
        $limit = (int) $request->query('limit', 4);

        $query = Spot::with(['area', 'tags']);

        if ($area) {
            $query->where('area', $area); 
        }

        $spots = $query
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return SpotResource::collection($spots);
    }
}
