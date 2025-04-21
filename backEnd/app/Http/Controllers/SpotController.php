<?php

namespace App\Http\Controllers;

use App\Models\Park;
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
        return response()->json($spots, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SpotRequest $request)
    {
        $request->validated();
        $park = Park::findOrFail($request->park_id);
        $nextNumber = 'P ' . ($park->spots()->count() + 1);

        // Use provided x/y or get the next available one
        $xy = isset($request->x, $request->y)
            ? ['x' => $request->x, 'y' => $request->y]
            : $this->getNextAvailableXY($park, 1)[0];

        $spot = Spot::create([
            'status' => $request->status ?? 'available',
            'park_id' => $park->id,
            'name' => $nextNumber,
            'type' => $request->type ?? 'standard',
            'x' => $xy['x'],
            'y' => $xy['y'],
        ]);

        return response()->json([
            'message' => 'Spot created and park capacity updated.',
            'spot' => $spot
        ], 201);
    }


    
    public function storeMultiple(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'park_id' => 'nullable|exists:parks,id',
            'count' => 'required|integer|min:1',
            'x' => 'nullable|integer',
            'y' => 'nullable|integer',
        ]);

        $park = Park::findOrFail($validated['park_id']);
        $existingCount = $park->spots()->count();
        $coords = $this->getNextAvailableXY($park, $validated['count']);

        $createdSpots = [];

        for ($i = 0; $i < $validated['count']; $i++) {
            $nextNumber = 'P ' . ($existingCount + $i + 1);

            $spot = Spot::create([
                'status' => $validated['status'] ?? 'available',
                'park_id' => $park->id,
                'name' => $nextNumber,
                'type' => $validated['type'] ?? 'standard',
                'x' => $coords[$i]['x'],
                'y' => $coords[$i]['y'],
            ]);

            $createdSpots[] = $spot;
        }

        return response()->json([
            'success' => true,
            'message' => "{$validated['count']} spots created successfully.",
            'spots' => $createdSpots
        ], 201);
    }


    public function storeMultipleExact(Request $request)
    {
        $validated = $request->validate([
            '*.park_id' => 'required|exists:parks,id',
            '*.name' => 'required|string|max:255',
            '*.x' => 'required|integer',
            '*.y' => 'required|integer',
            '*.type' => 'required|string|max:255',
            '*.status' => 'required|string|max:255',
        ]);

        $createdSpots = [];

        foreach ($validated as $spotData) {
            $spot = Spot::create([
                'park_id' => $spotData['park_id'],
                'name' => $spotData['name'],
                'x' => $spotData['x'],
                'y' => $spotData['y'],
                'type' => $spotData['type'],
                'status' => $spotData['status'],
            ]);

            $createdSpots[] = $spot;
        }

        return response()->json([
            'success' => true,
            'message' => count($createdSpots) . ' spot(s) created successfully.',
            'spots' => $createdSpots,
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
            'success' => true,
            'message' => 'Spot updated successfully.',
            'spot' => $spot
        ], 200);
    }


    public function updateMultiple(Request $request)
    {
        $validated = $request->validate([
            '*.id' => 'required|exists:spots,id',
            '*.name' => 'sometimes|string|max:255',
            '*.x' => 'sometimes|integer',
            '*.y' => 'sometimes|integer',
            '*.type' => 'sometimes|string|max:255',
            '*.status' => 'sometimes|string|max:255',
        ]);

        $updatedSpots = [];

        foreach ($validated as $spotData) {
            $spot = Spot::findOrFail($spotData['id']);
            $spot->update($spotData);
            $updatedSpots[] = $spot;
        }

        return response()->json([
            'success' => true,
            'message' => count($updatedSpots) . ' spot(s) updated successfully.',
            'spots' => $updatedSpots
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

    protected function getNextAvailableXY($park, int $count = 1): array
    {
        $occupied = Spot::where('park_id', $park->id)
            ->get(['x', 'y'])
            ->mapWithKeys(function ($spot) {
                return ["{$spot->x}_{$spot->y}" => true];
            })
            ->all();

        $maxX = Spot::where('park_id', $park->id)->max('x') ?? 0;
        // $maxY = Spot::where('park_id', $park->id)->max('y') ?? 0;
        if ($maxX == 0) { $maxX = 10;} // fallback to 10 columns minimum

        $coords = [];
        $x = 0;
        $y = 0;

        while (count($coords) < $count) {
            $key = "{$x}_{$y}";
            if (!isset($occupied[$key])) {
                $coords[] = ['x' => $x, 'y' => $y];
            }

            $x++;
            if ($x > $maxX) {
                $x = 0;
                $y++;
            }
        }

        return $coords;
    }


}
