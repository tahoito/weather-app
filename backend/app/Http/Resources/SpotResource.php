<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            'area' => is_object($this->area) ? ($this->area->name ?? null) : $this->area,
            'lat'  => (float) $this->lat,
            'lon'  => (float) $this->lon,
            'description' => $this->description ?? '',
            'image_url' => $this->image_url ? : 'https://placehold.co/300x200?text=No+Image',
            'is_indoor' => (bool) ($this->is_indoor ?? false),
            'weather_ok' => (bool) ($this->weather_ok ?? false),
            'tags' => $this->whenLoaded('tags',fn () => $this->tags->pluck('name')->values()),
        ];
    }
}
