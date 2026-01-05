<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SpotSearchController;

Route::get('/', function () {
    return view('welcome');
});
