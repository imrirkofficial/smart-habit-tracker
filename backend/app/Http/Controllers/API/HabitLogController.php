<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HabitLog;
use App\Models\Habit;
use Illuminate\Http\Request;


class HabitLogController extends Controller
{


    // Complete a habit

    public function store(Request $request)
    {


        $validated = $request->validate([

            'habit_id' => 'required|exists:habits,id',

            'completed_date' => 'required|date',

            'completed' => 'boolean',

            'duration' => 'nullable|integer',

            'mood' => 'nullable|in:excellent,good,normal,bad',

            'difficulty' => 'nullable|in:easy,medium,hard'

        ]);



        // Check habit belongs to user

        $habit = Habit::where('id',$validated['habit_id'])
                    ->where('user_id',$request->user()->id)
                    ->firstOrFail();



        $log = HabitLog::create($validated);



        return response()->json([

            'message'=>'Habit completed successfully',

            'log'=>$log

        ],201);


    }



    // Get logs of current user

    public function index(Request $request)
    {


        $logs = HabitLog::whereHas('habit',function($query) use ($request){

            $query->where(
                'user_id',
                $request->user()->id
            );

        })
        ->with('habit')
        ->get();



        return response()->json($logs);


    }



}