<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Spot;

class FavoriteController extends Controller
{
    private function dummyUserId(): int
    {
        return 1;
    }

    public function index()
    {
        $userId = $this->dummyUserId();
        $favorites = favorite::with('spot')
            ->where('user_id', $userId)
            ->latest()
            ->get();
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $userId = $this->dummyUserId();
        $validated = $request->validate(['spot_id' => ['required', 'integer', 'exists:spots,id'],]);
        $favorite = Favorite::firstOrCreate(['user_id' => $userId, 'spot_id' => $validated['spot_id'],]);
        return response()->json($favorite, 201);
    }

    public function destroy(Spot $spot)
    {
        $userId = $this->dummyUserId();

        Favorite::where('user_id', $userId)
            ->where('spot_id', $spot->id)
            ->delete();
        return response()->noContent();
    }
}
