<?php

namespace App\Http\Controllers;

use App\Models\Parc;
use Illuminate\Http\Request;


class ParcController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parcs = Parc::all();
        return response()->json($parcs);
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

        return response()->json($parc, 201);
        
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
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'capacite' => 'sometimes|required|integer|min:1',
            'adresse' => 'sometimes|required|string|max:255',
        ]);

        $parc = Parc::findOrFail($id);
        $parc->update($request->all());

        return response()->json($parc);
        
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
}
