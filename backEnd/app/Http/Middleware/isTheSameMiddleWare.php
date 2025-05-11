<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class isTheSameMiddleWare
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - User not found',
            ], 401);
        }
        if ((string)$user->id !== (string)$request->route('id')) {
            return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
            ], 403);
        }
        return $next($request);
    }
}
