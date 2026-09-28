<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

use App\Models\Habit;

use App\Models\HabitLog;

use Carbon\Carbon;



class HabitCompletionController extends Controller
{


    public function complete(Request $request, Habit $habit)
    {


        $user = $request->user();



        // Check habit ownership

        if($habit->user_id != $user->id)
        {

            return response()->json([

                "message" => "Unauthorized habit"

            ],403);

        }





        // Prevent duplicate completion

        $alreadyCompleted = HabitLog::where(
                'habit_id',
                $habit->id
            )
            ->whereDate(
                'completed_date',
                today()
            )
            ->where(
                'completed',
                true
            )
            ->exists();



        if($alreadyCompleted)
        {

            return response()->json([

                "message" => "Habit already completed today"

            ]);

        }





        DB::transaction(function() use ($habit, $user) {



            /*
            Create Habit Log
            */


            HabitLog::create([

                'habit_id' => $habit->id,

                'completed_date' => Carbon::today(),

                'completed' => true,

                'duration' => $habit->target,

                'mood' => 'good',

                'difficulty' => 'medium'

            ]);






            /*
            Gamification Reward
            */


            $xpReward = 20;

            $coinReward = 5;



            $user->xp += $xpReward;

            $user->coins += $coinReward;




            /*
            Update Streak
            */

            $user->current_streak += 1;



            if(
                $user->current_streak >
                $user->longest_streak
            )
            {

                $user->longest_streak =
                $user->current_streak;

            }





            /*
            Level System

            Every 100 XP = 1 Level

            */

            $user->level =
            floor($user->xp / 100) + 1;



            $user->save();



        });






        return response()->json([


            "message" => "Habit completed successfully",



            "reward" => [

                "xp_added" => 20,

                "coins_added" => 5

            ],



            "progress" => [

                "xp" => $user->xp,

                "level" => $user->level,

                "current_streak" => $user->current_streak,

                "longest_streak" => $user->longest_streak

            ]



        ]);



    }



}