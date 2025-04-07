<?php

namespace App\Http\Controllers;

use App\Http\Resources\SpotRresource;
use App\Models\Spot;
use Illuminate\Http\Request;

class SpotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SpotRresource::collection(Spot::all());
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'numero' => 'required|string|max:255',
            'etat' => 'required|string|max:255',
            'parc_id' => 'required|exists:parcs,id',
        ]);

        $spot = Spot::create($request->all());

        return new SpotRresource($spot);
    }

    /**
     * Display the specified resource.
     */
    public function show(Spot $spot)
    {
        return new SpotRresource($spot);
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Spot $spot)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Spot $spot)
    {
        $request->validate([
            'numero' => 'sometimes|required|string|max:255',
            'etat' => 'sometimes|required|string|max:255',
            'parc_id' => 'sometimes|required|exists:parcs,id',
        ]);

        $spot->update($request->all());

        return new SpotRresource($spot);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Spot $spot)
    {
        $spot->delete();

        return response()->json(['message' => 'Spot deleted successfully.'], 204);
    }
}
