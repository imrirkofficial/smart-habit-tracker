<?php

namespace App\Services;

use App\Models\HabitLog;
use App\Models\User;
use Carbon\Carbon;

class StreakService
{
    /*
    |--------------------------------------------------------------------------
    | Recalculate User Streak
    |--------------------------------------------------------------------------
    |
    | A streak is based on UNIQUE completed calendar days.
    |
    | Completing multiple habits on the same day counts as ONE streak day.
    |
    */

    public function recalculateForUser(User $user): array
    {
        $habitIds =
            $user
                ->habits()
                ->pluck('id');


        if ($habitIds->isEmpty()) {

            $user->current_streak = 0;
            $user->longest_streak = 0;

            $user->save();


            return [
                'current_streak' => 0,
                'longest_streak' => 0,
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Get Unique Completion Dates
        |--------------------------------------------------------------------------
        */

        $dates =
            HabitLog::query()

                ->whereIn(
                    'habit_id',
                    $habitIds
                )

                ->where(
                    'completed',
                    true
                )

                ->orderBy(
                    'completed_date'
                )

                ->get([
                    'completed_date'
                ])

                ->map(
                    function ($log) {

                        return Carbon::parse(
                            $log->completed_date
                        )->toDateString();

                    }
                )

                ->unique()

                ->values();


        if ($dates->isEmpty()) {

            $user->current_streak = 0;
            $user->longest_streak = 0;

            $user->save();


            return [
                'current_streak' => 0,
                'longest_streak' => 0,
            ];
        }


        /*
        |--------------------------------------------------------------------------
        | Fast Date Lookup
        |--------------------------------------------------------------------------
        */

        $dateLookup = [];


        foreach ($dates as $date) {

            $dateLookup[$date] = true;

        }


        /*
        |--------------------------------------------------------------------------
        | Current Streak
        |--------------------------------------------------------------------------
        |
        | If today is completed:
        | start from today.
        |
        | Otherwise:
        | yesterday can still represent the active streak.
        |
        */

        $today =
            now()
                ->startOfDay();


        $yesterday =
            $today
                ->copy()
                ->subDay();


        if (
            isset(
                $dateLookup[
                    $today->toDateString()
                ]
            )
        ) {

            $cursor =
                $today->copy();

        }
        elseif (
            isset(
                $dateLookup[
                    $yesterday->toDateString()
                ]
            )
        ) {

            $cursor =
                $yesterday->copy();

        }
        else {

            $cursor = null;

        }


        $currentStreak = 0;


        while ($cursor) {

            $dateString =
                $cursor->toDateString();


            if (
                !isset(
                    $dateLookup[
                        $dateString
                    ]
                )
            ) {

                break;

            }


            $currentStreak++;


            $cursor->subDay();

        }


        /*
        |--------------------------------------------------------------------------
        | Longest Streak
        |--------------------------------------------------------------------------
        */

        $longestStreak = 0;

        $runningStreak = 0;

        $previousDate = null;


        foreach ($dates as $dateString) {

            $date =
                Carbon::parse(
                    $dateString
                )->startOfDay();


            if ($previousDate === null) {

                $runningStreak = 1;

            }
            else {

                $difference =
                    $previousDate
                        ->diffInDays(
                            $date
                        );


                if ($difference === 1) {

                    $runningStreak++;

                }
                else {

                    $runningStreak = 1;

                }

            }


            $longestStreak =
                max(
                    $longestStreak,
                    $runningStreak
                );


            $previousDate =
                $date;

        }


        /*
        |--------------------------------------------------------------------------
        | Save User
        |--------------------------------------------------------------------------
        */

        $user->current_streak =
            $currentStreak;


        $user->longest_streak =
            $longestStreak;


        $user->save();


        return [

            'current_streak' =>
                $currentStreak,

            'longest_streak' =>
                $longestStreak,

        ];
    }
}