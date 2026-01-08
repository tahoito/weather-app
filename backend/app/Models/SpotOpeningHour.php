<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class SpotOpeningHour extends Model
{
    protected $fillable = [
        'spot_id',
        'day_of_week',
        'open_time',
        'close_time',   
    ];

    protected $casts = [
        'day_of_week' => 'integer', 
    ];

    public function spot(): BelongsTo
    {
        return $this->belongsTo(Spot::class);
    }
}
