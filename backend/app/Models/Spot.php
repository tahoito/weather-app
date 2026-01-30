<?php

namespace App\Models;

use App\Models\Favorite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Spot extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'lat' => 'float',
        'lon' => 'float',
        'is_indoor' => 'boolean',
        'image_urls' => 'array',
        'weather_suitability' => 'array',
        'highlights' => 'array',
        'weather_ok' => 'boolean',
        'tags_json' => 'array',
    ];


    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'spot_tag', 'spot_id', 'tag_id');
    }

    public function openingHours(): HasMany
    {
        return $this->hasMany(SpotOpeningHour::class);
    }
}
