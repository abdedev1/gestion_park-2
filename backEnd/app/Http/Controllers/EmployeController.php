<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use Illuminate\Http\Request;

class EmployeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employes = Employe::with('user')->get();
        return response()->json($employes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id', 
            'park_id' => 'required|exists:parks,id', 
        ]);
    
        $employe = Employe::create($validatedData);
    
        return response()->json([
            'message' => 'Employe created successfully',
            'employe' => $employe,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Employe $employe)
    {
        $employe->load('user'); 
        return response()->json($employe);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employe $employe)
    {
        $validatedData = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'park_id' => 'sometimes|required|exists:parks,id',
        ]);
    
        $employe->update($validatedData);
    
        return response()->json([
            'message' => 'Employe updated successfully',
            'employe' => $employe,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employe $employe)
    {
        $employe->delete();

        return response()->json([
            'message' => 'Employe deleted successfully',
        ]);
    }
    public function getEmployeSpots($id){
        $employe = Employe::findOrFail($id);
        $park = $employe->park;
        $spots = $park->spots;
        return response()->json($spots, 200);
    }

}
