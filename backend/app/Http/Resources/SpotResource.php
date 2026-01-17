<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tag = null;

        if (!empty($this->tag_json)) {
            $tag = trim((string) $this->tags_json[0]);
        } elseif (!empty($this->tags)) {
            $first = preg_split('/[,\s]+/', (string) $this->tags)[0] ?? null;
            $tag = $first !== null ? trim((string) $first) : null;
        }


        return [
            'id'   => $this->id,
            'name' => $this->name,
            'area' => $this->area,
            'lat'  => (float) $this->lat,
            'lon'  => (float) $this->lon,
            'description' => $this->description ?? '',
            'image_url' => $this->image_url ? : 'https://placehold.co/300x200?text=No+Image',
            'is_indoor' => (bool) ($this->is_indoor ?? false),
            'weather_ok' => (bool) ($this->weather_ok ?? false),
            'tag' => $tag,
        ];
    }
}
