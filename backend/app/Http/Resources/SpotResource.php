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
            'detail' => $this->detail,
            'image_url' => $this->image_url ?: 'https://placehold.co/300x200?text=No+Image',
            'is_indoor' => (bool) ($this->is_indoor ?? false),
            'weather_ok' => (bool) ($this->weather_ok ?? false),
            'tags' => $this->tags->pluck('name')->values()->all(),
            'price' => $this->price,
            'openingHours' => $this->opening_hours,
            'imageUrls' => is_string($this->image_urls) ? json_decode($this->image_urls, true) : $this->image_urls ?? [],
            'weatherSuitability' => is_string($this->weather_suitability) ? json_decode($this->weather_suitability, true) : $this->weather_suitability ?? [],
            'highlights' => is_string($this->highlights) ? json_decode($this->highlights, true) : $this->highlights ?? [],
        ];
    }
}
