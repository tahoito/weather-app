<?php

namespace App\Models;

use App\Models\Favorite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Spot extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'lat' => 'float',
        'lon' => 'float',
        'is_indoor' => 'boolean',
        'image_urls' => 'array',
        'tags_json' => 'array',
        'weather_suitability' => 'array',
        'highlights' => 'array',
        'is_indoor' => 'boolean',
        'weather_ok' => 'boolean',
    ];

    public function area(){
        return $this->belongsTo(Area::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
