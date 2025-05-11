<?php

namespace App\Http\Controllers;

use App\Models\Park;
use App\Models\Spot;
use Illuminate\Http\Request;
use App\Http\Requests\ParkRequest;


class ParkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parks = Park::with('spots')->get();
        return response()->json($parks,200);
    }

  
    public function store(ParkRequest $request)
    {
        $request->validated();

        $park = Park::create([
            'name' => $request->name,
            'address' => $request->address,
            'price' => $request->price,
        ]);

        // Number of spots to create
        $max_spots = $request->numberSpots;
        $max_columns = 10;

        $x = 0;
        $y = 0;

        for ($i = 0; $i < $max_spots; $i++) {
            Spot::create([
                'name' => 'P ' . ($i + 1),
                'type' => 'standard',
                'status' => 'available',
                'park_id' => $park->id,
                'x' => $x,
                'y' => $y,
            ]);

            $x++;
            if ($x >= $max_columns) {
                $x = 0;
                $y++;
            }
        }

        $park->load('spots');

        return response()->json([
            'message' => "Park created with {$max_spots} spots.",
            'park' => $park
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $park = Park::with(relations: 'spots')->findOrFail($id);
        return response()->json($park);
    }

    /**
     * Show the form for editing the specified resource.
     */
    

    /**
     * Update the specified resource in storage.
     */
    public function update(ParkRequest $request, string $id)
    {
        $request->validated();
        $park = Park::with('spots')->findOrFail($id);
        $park->update($request->all());
        return response()->json($park,201);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $park = Park::findOrFail($id);
        $park->delete();

        return response()->json(null, 204);
    }

    public function getParkEmployes($id){
        $employees = Park::find($id)->employees;
        return response()->json($employees,200);
    }
    public function getParkSpots($id){
        $spots = Park::find($id)->spots;
        return response()->json($spots,200);
    }
    public function search(Request $request)
{
    $query = $request->query('q');
    
    if (!$query) {
        return response()->json([
            'message' => 'Search query is required'
        ], 400);
    }

    $parks = Park::with('spots')
        ->where('name', 'like', "%{$query}%")
        ->orWhere('address', 'like', "%{$query}%")
        ->get();

    return response()->json($parks, 200);
}
}
