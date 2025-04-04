<?php

namespace App\Http\Controllers;

use App\Models\Parc;
use Illuminate\Http\Request;
use App\Http\Resources\ParcResource;

class ParcController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ParcResource::collection(Parc::all());
    }

    /**
     * Show the form for creating a new resource.
     */
  

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'capacite' => 'required|integer|min:1',
            'adresse' => 'required|string|max:255',
        ]);

        $parc = Parc::create($request->all());

        return new ParcResource($parc);
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $parc = Parc::findOrFail($id);

        return new ParcResource($parc);
        


    }

    /**
     * Show the form for editing the specified resource.
     */
    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'capacite' => 'required|integer|min:1',
            'adresse' => 'required|string|max:255',
        ]);

        $parc = Parc::findOrFail($id);
        $parc->update($request->all());

        return new ParcResource($parc);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $parc = Parc::findOrFail($id);
        $parc->delete();

        return response()->json(['message' => 'Parc deleted successfully']);
    }
}
