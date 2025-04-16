<?php

namespace App\Http\Controllers;

use App\Models\Parc;
use App\Models\Spot;
use Illuminate\Http\Request;
use App\Http\Requests\ParcRequest;


class ParcController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parcs = Parc::all();
        return response()->json($parcs,200);
    }

  
    public function store(ParcRequest $request)
    {
        $request->validated();
    
        $park = Parc::create([
            'nom' => $request->nom,
            'adresse' => $request->adresse,
        ]);
    
        for ($i = 0; $i < $request->numberSpots; $i++) {
            Spot::create([
                'nom' => 'P' . $i ,
                'type'=>'normal',
                'status' => 'disponible', 
                'parc_id' => $park->id,
                
                // default or customizable
            ]);
        }
    
        return response()->json([
            'message' => "Park created with {$request->numberSpots} spots.",
            'parc' => $park
        ], 201);
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $parc = Parc::findOrFail($id);
        return response()->json($parc);
        


    }

    /**
     * Show the form for editing the specified resource.
     */
    

    /**
     * Update the specified resource in storage.
     */
    public function update(ParcRequest $request, string $id)
    {
        $request->validated();
        $parc = Parc::findOrFail($id);
        $parc->update($request->all());
        

        return response()->json($parc,201);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $parc = Parc::findOrFail($id);
        $parc->delete();

        return response()->json(null, 204);
    }

    public function getParcEmployes($id){
        $employes = Parc::find($id)->employes;
        // $parc = Parc::with('employes.user')->find($id);
        //abdelilah
        return response()->json($employes,200);
    }
    public function getParcSpots($id){
        $spots = Parc::find($id)->spots;
        return response()->json($spots,200);
    }
}
