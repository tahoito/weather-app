<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;

class TagController extends Controller
{
    public function index()
    {
        return Tag::query()
            ->orderBy('id')
            ->get(['id', 'name', 'slug']);
    }
}
