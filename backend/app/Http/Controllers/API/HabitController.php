<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\Request;


class HabitController extends Controller
{


    // Get all habits

    public function index(Request $request)
    {

        $habits = Habit::where(
            'user_id',
            $request->user()->id
        )->with('category')->get();


        return response()->json($habits);

    }



    // Create habit

    public function store(Request $request)
    {

        $validated = $request->validate([

            'title'=>'required|string',

            'description'=>'nullable|string',

            'category_id'=>'nullable|exists:habit_categories,id',

            'frequency'=>'required',

            'target'=>'required|integer'

        ]);



        $habit = Habit::create([

            'user_id'=>$request->user()->id,

            ...$validated

        ]);



        return response()->json([

            'message'=>'Habit created successfully',

            'habit'=>$habit

        ],201);

    }



    // Show single habit

    public function show(Habit $habit)
    {

        return response()->json($habit);

    }



    // Update habit

    public function update(Request $request, Habit $habit)
    {


        $habit->update(
            $request->all()
        );


        return response()->json([

            'message'=>'Habit updated',

            'habit'=>$habit

        ]);

    }



    // Delete habit

    public function destroy(Habit $habit)
    {

        $habit->delete();


        return response()->json([

            'message'=>'Habit deleted'

        ]);

    }


}