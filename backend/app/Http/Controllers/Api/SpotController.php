<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spot;

class SpotController extends Controller
{
    //     public function recommended(Request $request)
    // {
    //     $area = $request->query('area'); // meieki など
    //     $limit = (int) $request->query('limit', 4);

    //     $query = Spot::query();

    //     if ($area) {
    //         $query->where('area', $area);
    //     }

    //     $spots = $query
    //         ->orderByDesc('created_at')
    //         ->limit($limit)
    //         ->get();

    //     return response()->json(
    //         $spots->map(fn($s) => [
    //             'id' => $s->id,
    //             'name' => $s->name,
    //             'area' => $s->area ?? '',
    //             'description' => $s->description ?? '',
    //             'imageUrl' => $s->image_url ?: 'https://placehold.co/300x200?text=No+Image',
    //             // spots.tags が "友達, ゆったり" みたいな文字列なら配列化
    //             'tags' => $s->tags
    //                 ? array_values(array_filter(array_map('trim', preg_split('/[,\s]+/', $s->tags))))
    //                 : [],
    //         ])
    //     );
    // }

    // public function recommended(Request $request)
    // {
    //     $area = $request->query('area'); // meieki
    //     $limit = (int) $request->query('limit', 4);

    //     $query = Spot::with(['area', 'tags']);

    //     // if ($area) {
    //     //     $query->whereHas('area', function ($q) use ($area) {
    //     //         $q->where('slug', $area);
    //     //     });
    //     // }
    //     if ($area) {
    //         $query->where('area', $area);
    //     }


    //     $spots = $query
    //         ->orderByDesc('created_at')
    //         ->limit($limit)
    //         ->get();

    //     return response()->json(
    //         $spots->map(fn($s) => [
    //             'id' => $s->id,
    //             'name' => $s->name,
    //             // 'area' => $s->area?->name ?? '',
    //             // 'area' => $s->area,
    //             'area' => is_object($s->area) ? $s->area->name : $s->area,
    //             'description' => $s->description ?? '',
    //             'image_url' => $s->image_url ?: 'https://placehold.co/300x200?text=No+Image',
    //             // 'tags' => $s->tags->pluck('name')->values(),
    //             'tags' => $s->relationLoaded('tags')
    //                 ? $s->tags->pluck('name')->values()
    //                 : [],

    //         ])
    //     );
    // }

    public function recommended(Request $request)
    {
        $area = $request->query('area'); // meieki
        $limit = (int) $request->query('limit', 4);

        $query = Spot::with(['area', 'tags']);

        if ($area) {
            $query->where('area', $area); // カラムに直接絞る
        }

        $spots = $query
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return response()->json(
            $spots->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                // 'area' => is_object($s->area) ? $s->area->name : $s->area,
                'area' => $s->area?->name ?? $s->area,
                'description' => $s->description ?? '',
                'image_url' => $s->image_url ?: 'https://placehold.co/300x200?text=No+Image',
                'tags' => is_iterable($s->tags)
                    ? collect($s->tags)->pluck('name')->values()
                    : (is_string($s->tags)
                        ? array_values(array_filter(array_map('trim', preg_split('/[,\s]+/', $s->tags))))
                        : []),
            ])
        );
    }
}
