<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

class SpotController extends Controller
{
    public function recommended(Request $request)
{
    $area = $request->query('area'); // meieki など
    $limit = (int) $request->query('limit', 4);

    $query = Spot::query();

    if ($area) {
        $query->where('area', $area);
    }

    $spots = $query
        ->orderByDesc('created_at')
        ->limit($limit)
        ->get();

    return response()->json(
        $spots->map(fn($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'area' => $s->area ?? '',
            'description' => $s->description ?? '',
            'imageUrl' => $s->image_url ?: 'https://placehold.co/300x200?text=No+Image',
            // spots.tags が "友達, ゆったり" みたいな文字列なら配列化
            'tags' => $s->tags
                ? array_values(array_filter(array_map('trim', preg_split('/[,\s]+/', $s->tags))))
                : [],
        ])
    );
}

}
