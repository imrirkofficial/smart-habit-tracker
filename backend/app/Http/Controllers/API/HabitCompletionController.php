<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use App\Models\HabitLog;
use App\Services\AchievementService;
use App\Services\StreakService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HabitCompletionController extends Controller
{
    public function __construct(

        private StreakService
            $streakService,

        private AchievementService
            $achievementService

    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Complete Habit
    |--------------------------------------------------------------------------
    */

    public function complete(
        Request $request,
        Habit $habit
    ): JsonResponse {

        $user =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | Ownership Check
        |--------------------------------------------------------------------------
        */

        if (
            !$user
            ||
            $habit->user_id
                !==
            $user->id
        ) {

            return response()->json([
                'message' =>
                    'Habit not found.',
            ], 404);

        }


        $today =
            Carbon::today();


        /*
        |--------------------------------------------------------------------------
        | Prevent Same Habit Twice Per Day
        |--------------------------------------------------------------------------
        */

        $alreadyCompleted =
            HabitLog::query()

                ->where(
                    'habit_id',
                    $habit->id
                )

                ->whereDate(
                    'completed_date',
                    $today
                )

                ->where(
                    'completed',
                    true
                )

                ->exists();


        if ($alreadyCompleted) {

            return response()->json([
                'message' =>
                    'This habit has already been completed today.',
            ], 409);

        }


        /*
        |--------------------------------------------------------------------------
        | Rewards
        |--------------------------------------------------------------------------
        */

        $habitXpReward = 20;

        $habitCoinReward = 5;


        /*
        |--------------------------------------------------------------------------
        | Transaction
        |--------------------------------------------------------------------------
        */

        $result =
            DB::transaction(
                function () use (
                    $habit,
                    $user,
                    $today,
                    $habitXpReward,
                    $habitCoinReward
                ) {


                    /*
                    |--------------------------------------------------------------------------
                    | Create Completion Log
                    |--------------------------------------------------------------------------
                    */

                    $log =
                        HabitLog::create([

                            'habit_id' =>
                                $habit->id,

                            'completed_date' =>
                                $today,

                            'completed' =>
                                true,

                            'duration' =>
                                $habit->target,

                            'mood' =>
                                'good',

                            'difficulty' =>
                                'medium',

                        ]);


                    /*
                    |--------------------------------------------------------------------------
                    | Base Habit Reward
                    |--------------------------------------------------------------------------
                    */

                    $user->xp =
                        (
                            $user->xp
                            ?? 0
                        )
                        +
                        $habitXpReward;


                    $user->coins =
                        (
                            $user->coins
                            ?? 0
                        )
                        +
                        $habitCoinReward;


                    $user->level =
                        floor(
                            $user->xp
                            /
                            100
                        )
                        +
                        1;


                    $user->save();


                    /*
                    |--------------------------------------------------------------------------
                    | Recalculate Real Daily Streak
                    |--------------------------------------------------------------------------
                    */

                    $streak =
                        $this
                            ->streakService
                            ->recalculateForUser(
                                $user
                            );


                    /*
                    |--------------------------------------------------------------------------
                    | Achievement Auto Unlock
                    |--------------------------------------------------------------------------
                    */

                    $achievementResult =
                        $this
                            ->achievementService
                            ->evaluateAndUnlock(
                                $user
                            );


                    /*
                    |--------------------------------------------------------------------------
                    | Refresh Final User Values
                    |--------------------------------------------------------------------------
                    */

                    $user->refresh();


                    return [

                        'log' =>
                            $log,

                        'streak' =>
                            $streak,

                        'achievements' =>
                            $achievementResult,

                    ];

                }
            );


        /*
        |--------------------------------------------------------------------------
        | Final Reward Totals
        |--------------------------------------------------------------------------
        */

        $achievementXp =
            $result[
                'achievements'
            ][
                'reward_xp'
            ]
            ?? 0;


        $achievementCoins =
            $result[
                'achievements'
            ][
                'reward_coins'
            ]
            ?? 0;


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'message' =>
                'Habit completed successfully',

            'habit' => [

                'id' =>
                    $habit->id,

                'title' =>
                    $habit->title,

            ],

            'reward' => [

                'habit_xp' =>
                    $habitXpReward,

                'habit_coins' =>
                    $habitCoinReward,

                'achievement_xp' =>
                    $achievementXp,

                'achievement_coins' =>
                    $achievementCoins,

                'total_xp_added' =>
                    $habitXpReward
                    +
                    $achievementXp,

                'total_coins_added' =>
                    $habitCoinReward
                    +
                    $achievementCoins,

            ],

            'progress' => [

                'xp' =>
                    (int) $user->xp,

                'level' =>
                    (int) $user->level,

                'coins' =>
                    (int) $user->coins,

                'current_streak' =>
                    (int)
                    $user->current_streak,

                'longest_streak' =>
                    (int)
                    $user->longest_streak,

            ],

            'newly_unlocked' =>
                $result[
                    'achievements'
                ][
                    'newly_unlocked'
                ]
                ?? [],

        ]);
    }
}