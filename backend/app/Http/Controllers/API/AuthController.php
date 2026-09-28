<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    // Register User
    public function register(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);


        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password']
        ]);


        $token = $user->createToken('mobile-app')->plainTextToken;


        return response()->json([

            'message' => 'User registered successfully',

            'user' => $user,

            'token' => $token

        ], 201);

    }



    // Login User
    public function login(Request $request)
    {

        $validated = $request->validate([

            'email' => 'required|email',

            'password' => 'required'

        ]);


        $user = User::where(
            'email',
            $validated['email']
        )->first();


        if(!$user || !password_verify(
            $validated['password'],
            $user->password
        )){

            return response()->json([

                'message'=>'Invalid email or password'

            ],401);

        }



        $token = $user
                ->createToken('mobile-app')
                ->plainTextToken;



        return response()->json([

            'message'=>'Login successful',

            'user'=>$user,

            'token'=>$token

        ]);

    }



    // Logout User
    public function logout(Request $request)
    {

        $request->user()
                ->currentAccessToken()
                ->delete();


        return response()->json([

            'message'=>'Logged out successfully'

        ]);

    }


}