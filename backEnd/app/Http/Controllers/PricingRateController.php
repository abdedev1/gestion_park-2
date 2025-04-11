<?php

namespace App\Http\Controllers;

use App\Models\PricingRate;
use Illuminate\Http\Request;

class PricingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pracing_rate = PricingRate::all();
        return response()->json($pracing_rate,201);
    }

  

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PricingRate $pricingRate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PricingRate $pricingRate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PricingRate $pricingRate)
    {
        //
    }
}
