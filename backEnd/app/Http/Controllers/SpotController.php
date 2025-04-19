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
        $request->validated();
        $park = Parc::findOrFail($request->parc_id);
        $nextNumero = 'P ' . ($park->spots()->count() + 1);
    
        $spot = Spot::create([
            'status' => $request->status ?? 'available',
            'parc_id' => $park->id,
            'nom' => $nextNumero,
            'type' => $request->type ?? 'normal',
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

    public function storeMultiple(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'parc_id' => 'nullable|exists:parcs,id',
            'count' => 'required|integer|min:1',
        ]);

        $park = Parc::findOrFail($validated['parc_id']);

        $createdSpots = [];
        $existingCount = $park->spots()->count();

        for ($i = 1; $i <= $validated['count']; $i++) {
            $nextNumero = 'P ' . ($existingCount + $i);

            $spot = Spot::create([
                'status' => $validated['status'] ?? 'available',
                'parc_id' => $park->id,
                'nom' => $nextNumero,
                'type' => $validated['type'] ?? 'normal',
            ]);

            $createdSpots[] = $spot;
        }

        return response()->json([
            'success' => true,
            'message' => "{$validated['count']} spots created successfully.",
            'spots' => $createdSpots
        ], 201);
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

        return response()->json([
            'success' => true,
            'message' => 'Spot deleted successfully.',
        ], 204);
    }

    public function destroyMultiple(Request $request)
    {
        $spotIds = $request->input('spot_ids');

        if (!is_array($spotIds) || empty($spotIds)) {
            return response()->json([
                'success' => false,
                'message' => 'No spot IDs provided.',
            ], 400);
        }

        Spot::whereIn('id', $spotIds)->delete();

        return response()->json([
            'success' => true,
            'message' => count($spotIds) . ' spots deleted successfully.',
        ], 200);
    }
}
