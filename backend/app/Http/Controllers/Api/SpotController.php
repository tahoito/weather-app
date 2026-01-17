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

        $q = Spot::query()->with(['area','tag']);

        if (!empty($validated['area'])) {
            $q->where('area', $validated['area']);
        }

        if ($request->filled('is_indoor')){
            $q->where('is_indoor',filter_var($request->input('is_indoor'),  FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('weather_ok')){
            $q->where('weather_ok',filter_var($request->input('weather_ok'),FILTER_VALIDATE_BOOLEAN));
        }

        $spots = $q->select(['id','name','lat','lon','area','description','image_url','is_indoor','weather_ok','tag'])
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
            ->select(['id','name','lat','lon','area','tag'])
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
        $weather = $request->query('weather','clear');
        $limit = (int) $request->query('limit', 4);

        $temp = $request->has('temp') ? (float) $request->query('temp') : null;
        $pop = $request->has('pop') ? (int) $request->query('pop') : null;
        $wind = $request->has('wind') ? (float) $request->query('wind') : null;
        $humidity = $request->has('humidity') ? (int) $request->query('humidity') : null;

        $indoorScore = 0;

        if ($pop !== null) {
            if ($pop >= 80) $indoorScore += 50;
            elseif ($pop >= 60) $indoorScore += 35;
            elseif ($pop >= 40) $indoorScore += 15;
        }

        if ($wind !== null) {
            if ($wind >= 10) $indoorScore += 25;
            elseif ($wind >= 8) $indoorScore += 15;
            elseif ($wind >= 6) $indoorScore += 8;
        }

        if ($temp !== null) {
            if ($temp <= 7) $indoorScore += 15;
            elseif ($temp <= 10) $indoorScore += 10;

            if ($temp >= 32) $indoorScore += 15;
            elseif ($temp >= 30) $indoorScore += 10;
        }

        if ($humidity != null) {
            if ($humidity >= 85) $indoorScore += 10;
            elseif ($humidity >= 60) $indoorScore += 5;
        }

        $q = Spot::query();

        if ($indoorScore >= 50) {
            $q->orderByDesc('is_indoor');
        }else {
            $q->orderBy('is_indoor');
        }

        $q->orderByDesc('weather_ok')->orderByDesc('created_at');

        $spots = $q->limit($limit)->get();

        $mode = $indoorScore >= 50 ? 'indoor' : 'outdoor';

        $spots = $q->limit($limit)->get();

        return SpotResource::collection($spots)->additional([
            'meta' => [
                'indoor_score' => $indoorScore,
                'mode' => $mode,
            ],
        ]);
    }
}
