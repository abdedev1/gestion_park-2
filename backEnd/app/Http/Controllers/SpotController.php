<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpotRequest;
use App\Models\Spot;
use Illuminate\Http\Request;

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

        $spot = Spot::create($request->all());

        return response()->json([
            'message'=>'The new spot has been added successfully!',
            'spot'=>$spot
        ],201);
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
