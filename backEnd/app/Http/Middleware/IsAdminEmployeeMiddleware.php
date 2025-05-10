<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdminEmployeeMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        // Corrected condition using 'in_array' for better readability
        if (!in_array($user->role->name, ['admin', 'employe'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin or Employee access required',
            ], 403);
        }

        return $next($request);
    }
}