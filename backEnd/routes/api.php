<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParcController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SpotController;

use App\Http\Controllers\EmployeController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::post("/register", [AuthController::class, 'register']);
Route::post("/login", [AuthController::class, 'login']);
Route::apiResource('/users', UserController::class);
Route::apiResource('/roles', RoleController::class);
Route::get("/parcs", [ParcController::class, 'index']);
Route::post("/parcs", [ParcController::class, 'store']);
Route::get("/users", [UserController::class, 'index']);
Route::apiResource("parcs",ParcController::class);
Route::apiResource('spots',SpotController::class);
Route::get('/parcs/{id}/employes',[ParcController::class,'getParcEmployes']);
Route::get('/parcs/{id}/spots',[ParcController::class,'getParcSpots']);
Route::apiResource('employes', EmployeController::class);
