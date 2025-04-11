<?php

namespace App\Http\Controllers;

use App\Models\Parc;
use App\Models\Spot;
use Illuminate\Http\Request;
use App\Http\Requests\SpotRequest;

class SpotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $spots = Spot::all();
        return response()->json($spots,200);
        
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(SpotRequest $request)
    {
        $request->validate([
            'numero' => 'nullable|string',
            'parc_id' => 'required|exists:parcs,id',
            'etat' => 'nullable|string',
        ]);
    
        $park = Parc::findOrFail($request->parc_id);
    
       
        $nextNumero = 'P' . ($park->spots()->count() + 1);
    
        $spot = Spot::create([
            
            'etat' => $request->etat ?? 'available',
            'parc_id' => $park->id,
            'numero' => $nextNumero,
        ]);
    
      
        $park->update([
            'capacite' => $park->spots()->count()
        ]);
    
        return response()->json([
            'message' => 'Spot created and park capacity updated.',
            'spot' => $spot
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Spot $spot)
    {
        return response()->json([
            'message' => 'Spot details fetched successfully.',
            'spot' => $spot
        ], 200);
    }
    



    /**
     * Update the specified resource in storage.
     */
    public function update(SpotRequest $request, Spot $spot)
    {
        $request->validated();
    
        $spot->update($request->all());
    
        return response()->json([
            'message' => 'Spot updated successfully.',
            'spot' => $spot
        ], 200);
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
