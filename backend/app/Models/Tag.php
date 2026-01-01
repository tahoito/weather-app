<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    public function spots()
    {
        return $this->belongsToMany(Spot::class);
    }
}
