<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ParkController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\isAdminMiddleWare;
use App\Http\Controllers\EmployeController;
use App\Http\Middleware\isClientMiddleWare;
use App\Http\Middleware\isEmployeMiddleWare;
use App\Http\Middleware\isTheSameMiddleWare;
use App\Http\Controllers\DemandCardController;
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

Route::middleware(["auth:sanctum", isAdminMiddleWare::class])->group(function(){
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('employes', EmployeController::class);
    Route::apiResource("parks",ParkController::class)->except(['index', 'show']);
    Route::delete('spots', [SpotController::class, 'destroyMultiple'])->name('spots.destroyMultiple');
    Route::post('spots/multiple', [SpotController::class, 'storeMultiple'])->name('spots.storeMultiple');
    Route::post('spots/exact', [SpotController::class, 'storeMultipleExact'])->name('spots.storeMultipleExact');
    Route::put('spots/multiple', [SpotController::class, 'updateMultiple'])->name('spots.updateMultiple');
    Route::apiResource('users', UserController::class);

});

Route::middleware(["auth:sanctum", isEmployeMiddleWare::class])->group(function(){
    Route::apiResource('employes', EmployeController::class);
    Route::get('/parks/search', [ParkController::class, 'search']);
    Route::get('/demand-cards', [DemandCardController::class, 'index']);
    
});

Route::middleware(["auth:sanctum", isClientMiddleWare::class])->group(function(){

});
Route::middleware(["auth:sanctum", isTheSameMiddleWare::class])->group(function(){
    Route::put('/profile/{id}', [UserController::class, 'update']);
    Route::put('/change-password/{id}', [UserController::class, 'changePassword']);
    Route::delete('/profile/{id}', [UserController::class, 'destroy']);
});

Route::middleware(["auth:sanctum", IsAdminEmployeeMiddleware::class])->group(function(){
    // admin and employe routes
    Route::apiResource('spots',controller: SpotController::class);
    Route::apiResource('employes', EmployeController::class);
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);

});

// internaute routes
Route::get("/parks", [ParkController::class, 'index']);
Route::get("/parks/{id}", [ParkController::class, 'show']);

// routes li mazal ma tkhchaw f blasthomm
Route::get('/parks/{id}/employes',[ParkController::class,'getParkEmployes']);
Route::get('/parks/{id}/spots',[ParkController::class,'getParkSpots']);

Route::get('/employes/{id}/spots', [EmployeController::class, 'getEmployeSpots']);
Route::apiResource('parking-tickets', ParkingTicketController::class);
Route::apiResource('pricing_rates', PricingRateController::class);
Route::post('/carts', [CartController::class, 'store']);
Route::apiResource('demand-cards', DemandCardController::class);

