<?php

use App\Http\Controllers\ParcController;
use App\Http\Controllers\SpotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('parcs', ParcController::class);
Route::apiResource('spots', SpotController::class);
