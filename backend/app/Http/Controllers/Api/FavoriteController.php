<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Spot;
use App\Http\Resources\SpotResource;


class FavoriteController extends Controller
{
    private function dummyUserId(): int
    {
        return 1;
    }

    public function index()
    {
        $userId = $this->dummyUserId();

        $spots = Favorite::where('user_id', $userId)
            ->with('spot.tags')    
            ->latest()
            ->get()
            ->pluck('spot')
            ->filter()
            ->values();           

        return SpotResource::collection($spots);
    }

    public function store(Request $request)
    {
        $userId = $this->dummyUserId();
        $validated = $request->validate(['spot_id' => ['required', 'integer', 'exists:spots,id'],]);
        $favorite = Favorite::firstOrCreate(['user_id' => $userId, 'spot_id' => $validated['spot_id'],]);

        $favorite->load('spot.tags');

        return response()->json([
            'id' => $favorite->id,
            'spot' => new \App\Http\Resources\SpotResource($favorite->spot),
        ], 201);
    }

    public function destroy(int $spotId)
    {
        $userId = $this->dummyUserId();

        Favorite::where('user_id', $userId)
            ->where('spot_id', $spotId)
            ->delete();

        return response()->noContent();
    }
}
