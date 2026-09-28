<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HabitLog;


class AIInsightController extends Controller
{


    public function index(Request $request)
    {

        $user = $request->user();


        // Total habits
        $totalHabits = $user->habits()->count();



        // Total completed habits
        $completed = HabitLog::whereHas('habit', function($query) use ($user){

            $query->where('user_id', $user->id);

        })
        ->where('completed', true)
        ->count();



        // Completion rate

        $totalLogs = HabitLog::whereHas('habit', function($query) use ($user){

            $query->where('user_id', $user->id);

        })
        ->count();



        $rate = $totalLogs > 0 
                ? round(($completed / $totalLogs) * 100)
                : 0;



        /*
        AI Recommendation Logic
        */


        if($totalHabits == 0)
        {

            $message = "Start by creating your first habit. Small actions create big changes.";

            $type = "start";

        }


        elseif($rate >= 80)
        {

            $message = "Excellent consistency! Your habits are becoming part of your routine.";

            $type = "excellent";

        }


        elseif($rate >= 50)
        {

            $message = "Good progress! Try maintaining your daily schedule to improve consistency.";

            $type = "good";

        }


        else
        {

            $message = "Your completion rate is low. Try reducing habit difficulty and focus on small wins.";

            $type = "improvement";

        }



        return response()->json([

            "total_habits" => $totalHabits,

            "completed_habits" => $completed,

            "completion_rate" => $rate,

            "insight" => $message,

            "type" => $type

        ]);

    }


}