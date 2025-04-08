<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $request->validated();
        $user = User::create($request->all());
    
        $token = $user->createToken('auth_token');
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'birth_date' => $user->birth_date,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ],
            'token' => $token->plainTextToken,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $request->validated();
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('auth_token');
            $expires = now()->addDay(30)->diffInDays(now(), true);
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'token' => $token->plainTextToken,
                'expires' => $expires,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Email or password is incorrect',
            ], 401);
        }
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ], 200);
    }

}