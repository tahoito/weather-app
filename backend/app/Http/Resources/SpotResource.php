<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Tag;


class SpotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tagName = null;


        if (!empty($this->tag)) {
            $slug = trim($this->tag);

            $tagName = Tag::where('slug', $slug)->value('name');
        }

        return [
            'id'   => $this->id,
            'name' => $this->name,
            'area' => $this->area,
            'lat'  => (float) $this->lat,
            'lon'  => (float) $this->lon,
            'description' => $this->description ?? '',
            'image_url' => $this->image_url ?: 'https://placehold.co/300x200?text=No+Image',
            'is_indoor' => (bool) ($this->is_indoor ?? false),
            'weather_ok' => (bool) ($this->weather_ok ?? false),
            'tags' => $this->tags->pluck('name'),



        ];
    }
}
