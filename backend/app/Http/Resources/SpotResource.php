<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tags = [];

        if (!empty($this->tags_json)) {
            $tags = is_array($this->tags_json) ? $this->tags_json : [];
        } elseif (!empty($this->tags)) {
            $tags = array_values(array_filter(array_map(
                'trim',
                preg_split('/[,\s]+/', (string) $this->tags)
            )));
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
            'tags' => $tags,
        ];
    }
}
