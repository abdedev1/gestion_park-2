<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParcController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::post("/register", [AuthController::class, 'register']);
Route::post("/login", [AuthController::class, 'login']);
Route::get("/users", [UserController::class, 'index']);
Route::get("/parcs", [ParcController::class, 'index']);
Route::post("/parcs", [ParcController::class, 'store']);
