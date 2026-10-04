<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HabitLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Premium Analytics Dashboard
    |--------------------------------------------------------------------------
    |
    | GET /api/analytics
    |
    */

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();


        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }


        $today = now()->startOfDay();

        $weekStart =
            $today
                ->copy()
                ->subDays(6);

        $monthStart =
            $today
                ->copy()
                ->startOfMonth();

        $performanceStart =
            $today
                ->copy()
                ->subDays(29);


        /*
        |--------------------------------------------------------------------------
        | User Habits
        |--------------------------------------------------------------------------
        */

        $habits =
            $user
                ->habits()
                ->get([
                    'id',
                    'title',
                    'frequency',
                    'target',
                    'created_at',
                ]);


        $habitIds =
            $habits->pluck('id');


        /*
        |--------------------------------------------------------------------------
        | Completed Logs
        |--------------------------------------------------------------------------
        */

        $completedLogs = collect();


        if ($habitIds->isNotEmpty()) {

            $completedLogs =
                HabitLog::query()

                    ->whereIn(
                        'habit_id',
                        $habitIds
                    )

                    ->where(
                        'completed',
                        true
                    )

                    ->whereBetween(
                        'completed_date',
                        [
                            $performanceStart
                                ->toDateString(),

                            $today
                                ->toDateString(),
                        ]
                    )

                    ->orderBy(
                        'completed_date'
                    )

                    ->get([
                        'habit_id',
                        'completed_date',
                    ]);

        }


        /*
        |--------------------------------------------------------------------------
        | All-Time Completion Count
        |--------------------------------------------------------------------------
        */

        $totalCompletedLogs = 0;


        if ($habitIds->isNotEmpty()) {

            $totalCompletedLogs =
                HabitLog::query()

                    ->whereIn(
                        'habit_id',
                        $habitIds
                    )

                    ->where(
                        'completed',
                        true
                    )

                    ->count();

        }


        /*
        |--------------------------------------------------------------------------
        | Group Logs By Date
        |--------------------------------------------------------------------------
        */

        $logsByDate =
            $completedLogs
                ->groupBy(
                    function ($log) {

                        return
                            $log
                                ->completed_date
                                ->toDateString();

                    }
                );


        /*
        |--------------------------------------------------------------------------
        | Today Analytics
        |--------------------------------------------------------------------------
        */

        $todayString =
            $today->toDateString();


        $todayLogs =
            $logsByDate->get(
                $todayString,
                collect()
            );


        $completedToday =
            $todayLogs
                ->pluck('habit_id')
                ->unique()
                ->count();


        $totalHabits =
            $habits->count();


        $todayCompletionRate =
            $totalHabits > 0

            ? round(
                (
                    $completedToday
                    /
                    $totalHabits
                )
                * 100
            )

            : 0;


        /*
        |--------------------------------------------------------------------------
        | Weekly Analytics - Last 7 Days
        |--------------------------------------------------------------------------
        */

        $weeklyReport = [];

        $weeklyCompleted = 0;

        $weeklyPossible = 0;


        for (
            $offset = 0;
            $offset < 7;
            $offset++
        ) {

            $date =
                $weekStart
                    ->copy()
                    ->addDays($offset);


            $dateString =
                $date->toDateString();


            /*
            Habits that already existed
            on this date.
            */

            $availableHabits =
                $habits->filter(
                    function ($habit) use ($dateString) {

                        if (!$habit->created_at) {
                            return true;
                        }


                        return
                            $habit
                                ->created_at
                                ->toDateString()
                            <= $dateString;

                    }
                );


            $availableHabitIds =
                $availableHabits
                    ->pluck('id');


            $possibleCount =
                $availableHabitIds
                    ->count();


            $dayLogs =
                $logsByDate->get(
                    $dateString,
                    collect()
                );


            $completedCount =
                $dayLogs
                    ->pluck('habit_id')
                    ->unique()
                    ->filter(
                        function ($habitId) use ($availableHabitIds) {

                            return
                                $availableHabitIds
                                    ->contains(
                                        $habitId
                                    );

                        }
                    )
                    ->count();


            $completedCount =
                min(
                    $completedCount,
                    $possibleCount
                );


            $rate =
                $possibleCount > 0

                ? round(
                    (
                        $completedCount
                        /
                        $possibleCount
                    )
                    * 100
                )

                : 0;


            $weeklyCompleted +=
                $completedCount;


            $weeklyPossible +=
                $possibleCount;


            $weeklyReport[] = [

                'date' =>
                    $dateString,

                'day' =>
                    $date->format('D'),

                'day_short' =>
                    $date->format('D'),

                'completed' =>
                    $completedCount,

                'total' =>
                    $possibleCount,

                'completion_rate' =>
                    $rate,

            ];

        }


        $weeklyCompletionRate =
            $weeklyPossible > 0

            ? round(
                (
                    $weeklyCompleted
                    /
                    $weeklyPossible
                )
                * 100
            )

            : 0;


        /*
        |--------------------------------------------------------------------------
        | Monthly Analytics
        |--------------------------------------------------------------------------
        */

        $monthlyCompleted = 0;

        $monthlyPossible = 0;

        $completedDays = 0;

        $partialDays = 0;

        $missedDays = 0;

        $bestDay = null;

        $bestRate = -1;


        $cursor =
            $monthStart->copy();


        while (
            $cursor->lessThanOrEqualTo(
                $today
            )
        ) {

            $dateString =
                $cursor->toDateString();


            $availableHabits =
                $habits->filter(
                    function ($habit) use ($dateString) {

                        if (!$habit->created_at) {
                            return true;
                        }


                        return
                            $habit
                                ->created_at
                                ->toDateString()
                            <= $dateString;

                    }
                );


            $availableHabitIds =
                $availableHabits
                    ->pluck('id');


            $possibleCount =
                $availableHabitIds
                    ->count();


            $dayLogs =
                $logsByDate->get(
                    $dateString,
                    collect()
                );


            $completedCount =
                $dayLogs
                    ->pluck('habit_id')
                    ->unique()
                    ->filter(
                        function ($habitId) use ($availableHabitIds) {

                            return
                                $availableHabitIds
                                    ->contains(
                                        $habitId
                                    );

                        }
                    )
                    ->count();


            $completedCount =
                min(
                    $completedCount,
                    $possibleCount
                );


            $rate =
                $possibleCount > 0

                ? round(
                    (
                        $completedCount
                        /
                        $possibleCount
                    )
                    * 100
                )

                : 0;


            $monthlyCompleted +=
                $completedCount;


            $monthlyPossible +=
                $possibleCount;


            if ($possibleCount > 0) {

                if (
                    $completedCount
                    >=
                    $possibleCount
                ) {

                    $completedDays++;

                }
                elseif ($completedCount > 0) {

                    $partialDays++;

                }
                else {

                    /*
                    Do not count today as missed
                    while the day is still active.
                    */

                    if (
                        !$cursor->isSameDay(
                            $today
                        )
                    ) {

                        $missedDays++;

                    }

                }


                if ($rate > $bestRate) {

                    $bestRate =
                        $rate;


                    $bestDay = [

                        'date' =>
                            $dateString,

                        'day' =>
                            $cursor
                                ->format('l'),

                        'completion_rate' =>
                            $rate,

                        'completed' =>
                            $completedCount,

                        'total' =>
                            $possibleCount,

                    ];

                }

            }


            $cursor->addDay();

        }


        $monthlyCompletionRate =
            $monthlyPossible > 0

            ? round(
                (
                    $monthlyCompleted
                    /
                    $monthlyPossible
                )
                * 100
            )

            : 0;


        /*
        |--------------------------------------------------------------------------
        | Productivity Score
        |--------------------------------------------------------------------------
        |
        | 60% recent weekly consistency
        | 40% current monthly consistency
        |
        */

        $productivityScore =
            round(
                (
                    $weeklyCompletionRate
                    * 0.60
                )
                +
                (
                    $monthlyCompletionRate
                    * 0.40
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Habit Performance - Last 30 Days
        |--------------------------------------------------------------------------
        */

        $habitPerformance =
            $habits
                ->map(
                    function ($habit) use (
                        $completedLogs,
                        $today,
                        $performanceStart
                    ) {

                        $habitStart =
                            $habit->created_at
                            ? Carbon::parse(
                                $habit->created_at
                            )->startOfDay()
                            : $performanceStart->copy();


                        if (
                            $habitStart
                                ->lessThan(
                                    $performanceStart
                                )
                        ) {

                            $habitStart =
                                $performanceStart
                                    ->copy();

                        }


                        if (
                            $habitStart
                                ->greaterThan(
                                    $today
                                )
                        ) {

                            $possibleDays = 0;

                        }
                        else {

                            $possibleDays =
                                $habitStart
                                    ->diffInDays(
                                        $today
                                    )
                                + 1;

                        }


                        $logs =
                            $completedLogs
                                ->where(
                                    'habit_id',
                                    $habit->id
                                );


                        $uniqueCompletedDays =
                            $logs
                                ->map(
                                    function ($log) {

                                        return
                                            $log
                                                ->completed_date
                                                ->toDateString();

                                    }
                                )
                                ->unique()
                                ->count();


                        $rate =
                            $possibleDays > 0

                            ? round(
                                (
                                    $uniqueCompletedDays
                                    /
                                    $possibleDays
                                )
                                * 100
                            )

                            : 0;


                        $lastCompleted =
                            $logs
                                ->sortByDesc(
                                    function ($log) {

                                        return
                                            $log
                                                ->completed_date
                                                ->timestamp;

                                    }
                                )
                                ->first();


                        return [

                            'id' =>
                                $habit->id,

                            'title' =>
                                $habit->title,

                            'frequency' =>
                                $habit->frequency,

                            'target' =>
                                $habit->target,

                            'completed_days' =>
                                $uniqueCompletedDays,

                            'possible_days' =>
                                $possibleDays,

                            'completion_rate' =>
                                min(
                                    $rate,
                                    100
                                ),

                            'last_completed' =>
                                $lastCompleted
                                ? $lastCompleted
                                    ->completed_date
                                    ->toDateString()
                                : null,

                        ];

                    }
                )
                ->sortByDesc(
                    'completion_rate'
                )
                ->values();


        /*
        |--------------------------------------------------------------------------
        | Weekly Chart Compatibility
        |--------------------------------------------------------------------------
        */

        $weeklyProgress =
            collect(
                $weeklyReport
            )
                ->pluck(
                    'completion_rate'
                )
                ->values();


        $weeklyLabels =
            collect(
                $weeklyReport
            )
                ->pluck(
                    'day_short'
                )
                ->values();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            /*
            Basic dashboard compatibility
            */

            'total_habits' =>
                $totalHabits,

            'completed_today' =>
                $completedToday,

            'completed_habits' =>
                $totalCompletedLogs,

            'completion_rate' =>
                $todayCompletionRate,


            /*
            Gamification
            */

            'xp' =>
                (int) (
                    $user->xp
                    ?? 0
                ),

            'level' =>
                (int) (
                    $user->level
                    ?? 1
                ),

            'coins' =>
                (int) (
                    $user->coins
                    ?? 0
                ),

            'current_streak' =>
                (int) (
                    $user->current_streak
                    ?? 0
                ),

            'longest_streak' =>
                (int) (
                    $user->longest_streak
                    ?? 0
                ),


            /*
            Productivity
            */

            'productivity_score' =>
                $productivityScore,


            /*
            Weekly
            */

            'weekly_progress' =>
                $weeklyProgress,

            'weekly_labels' =>
                $weeklyLabels,

            'weekly_completion_rate' =>
                $weeklyCompletionRate,

            'weekly_completed' =>
                $weeklyCompleted,

            'weekly_possible' =>
                $weeklyPossible,

            'weekly_report' =>
                $weeklyReport,


            /*
            Monthly
            */

            'monthly' => [

                'month' =>
                    $today
                        ->format('Y-m'),

                'completion_rate' =>
                    $monthlyCompletionRate,

                'completed' =>
                    $monthlyCompleted,

                'possible' =>
                    $monthlyPossible,

                'completed_days' =>
                    $completedDays,

                'partial_days' =>
                    $partialDays,

                'missed_days' =>
                    $missedDays,

                'best_day' =>
                    $bestDay,

            ],


            /*
            Habit performance
            */

            'habit_performance' =>
                $habitPerformance,

        ]);
    }
}