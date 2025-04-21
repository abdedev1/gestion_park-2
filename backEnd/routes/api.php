<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParkController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\isAdminMiddleWare;
use App\Http\Controllers\EmployeController;
use App\Http\Middleware\isClientMiddleWare;
use App\Http\Middleware\isEmployeMiddleWare;
use App\Http\Controllers\PricingRateController;
use App\Http\Controllers\ParkingTicketController;
use App\Http\Middleware\AlreadyLoggedInMiddleware;
use App\Http\Middleware\IsAdminEmployeeMiddleware;

Route::middleware(AlreadyLoggedInMiddleware::class)->group(function(){
    Route::post("/register", [AuthController::class, 'register']);
    Route::post("/login", [AuthController::class, 'login']);
});

Route::middleware("auth:sanctum")->controller(AuthController::class)->group(function(){
    Route::get("user", "getUser");
    Route::post("logout", "logout");
});

Route::middleware(isAdminMiddleWare::class)->group(function(){
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('employes', EmployeController::class);
    Route::apiResource("parks",ParkController::class)->except(['index', 'show']);
    Route::delete('spots', [SpotController::class, 'destroyMultiple'])->name('spots.destroyMultiple');
    Route::post('spots/multiple', [SpotController::class, 'storeMultiple'])->name('spots.storeMultiple');
    Route::post('spots/exact', [SpotController::class, 'storeMultipleExact'])->name('spots.storeMultipleExact');
    Route::put('spots/multiple', [SpotController::class, 'updateMultiple'])->name('spots.updateMultiple');
});

Route::middleware(isEmployeMiddleWare::class)->group(function(){
    Route::apiResource('pricing_rates', PricingRateController::class);
    Route::apiResource('employes', EmployeController::class);
    Route::get('/parks/search', [ParkController::class, 'search']);
    
});

Route::middleware(isClientMiddleWare::class)->group(function(){
    
});
Route::middleware(IsAdminEmployeeMiddleware::class)->group(function(){
    // admin and employe routes
    Route::apiResource('spots',controller: SpotController::class);
    Route::apiResource('employes', EmployeController::class);


});

// internaute routes
Route::get("/parks", [ParkController::class, 'index']);
Route::get("/parks/{id}", [ParkController::class, 'show']);

// routes li mazal ma tkhchaw f blasthomm
Route::get('/parks/{id}/employes',[ParkController::class,'getParkEmployes']);
Route::get('/parks/{id}/spots',[ParkController::class,'getParkSpots']);

Route::get('/employes/{id}/spots', [EmployeController::class, 'getEmployeSpots']);
Route::apiResource('parking-tickets', ParkingTicketController::class);
