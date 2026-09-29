<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;

use Illuminate\Http\Request;



class ProfileController extends Controller
{


    public function index(Request $request)
    {


        return response()->json([

            "id"=>$request->user()->id,

            "name"=>$request->user()->name,

            "email"=>$request->user()->email,

            "xp"=>$request->user()->xp,

            "level"=>$request->user()->level,

            "coins"=>$request->user()->coins,

            "current_streak"=>$request->user()->current_streak,

            "longest_streak"=>$request->user()->longest_streak,

            "language"=>$request->user()->language


        ]);


    }



}