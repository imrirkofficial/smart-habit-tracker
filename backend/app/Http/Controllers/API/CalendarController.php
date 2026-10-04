<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HabitLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Calendar Heatmap API
    |--------------------------------------------------------------------------
    |
    | Example:
    | GET /api/calendar?month=2026-10
    |
    */

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'month' => [
                'nullable',
                'regex:/^\d{4}-\d{2}$/',
            ],
        ]);


        $user = $request->user();


        $monthInput =
            $request->query(
                'month',
                now()->format('Y-m')
            );


        try {

            $start =
                Carbon::createFromFormat(
                    'Y-m-d',
                    $monthInput . '-01'
                )
                ->startOfMonth();


        } catch (\Throwable $exception) {

            return response()->json([
                'message' => 'Invalid month.',
            ], 422);

        }


        $end =
            $start
                ->copy()
                ->endOfMonth();


        $today =
            now()->startOfDay();



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
                    'created_at',
                ]);


        $habitIds =
            $habits
                ->pluck('id');



        /*
        |--------------------------------------------------------------------------
        | Completed Logs For Selected Month
        |--------------------------------------------------------------------------
        */


        $logs = collect();


        if ($habitIds->isNotEmpty()) {

            $logs =
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
                            $start->toDateString(),
                            $end->toDateString(),
                        ]
                    )
                    ->get([
                        'habit_id',
                        'completed_date',
                    ]);

        }



        /*
        |--------------------------------------------------------------------------
        | Group Logs By Date
        |--------------------------------------------------------------------------
        */


        $completedByDate =
            $logs
                ->groupBy(
                    function ($log) {

                        return
                            $log
                                ->completed_date
                                ->toDateString();

                    }
                )
                ->map(
                    function ($items) {

                        /*
                        One habit counts once
                        per calendar day.
                        */

                        return
                            $items
                                ->pluck('habit_id')
                                ->unique()
                                ->count();

                    }
                );



        /*
        |--------------------------------------------------------------------------
        | Build Month
        |--------------------------------------------------------------------------
        */


        $days = [];


        $totalCompletions = 0;

        $possibleCompletions = 0;

        $completedDays = 0;

        $partialDays = 0;

        $missedDays = 0;

        $bestDay = null;

        $bestRate = -1;



        for (
            $dayNumber = 1;
            $dayNumber <= $start->daysInMonth;
            $dayNumber++
        ) {


            $date =
                $start
                    ->copy()
                    ->day($dayNumber)
                    ->startOfDay();


            $dateString =
                $date->toDateString();



            /*
            |--------------------------------------------------------------------------
            | Habits That Existed On This Date
            |--------------------------------------------------------------------------
            */


            $habitsForDay =
                $habits
                    ->filter(
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


            $totalHabitsForDay =
                $habitsForDay->count();



            $completedCount =
                (int) (
                    $completedByDate[
                        $dateString
                    ]
                    ?? 0
                );


            /*
            Do not allow old duplicate logs
            to produce more than 100%.
            */

            $completedCount =
                min(
                    $completedCount,
                    $totalHabitsForDay
                );



            $isFuture =
                $date->greaterThan($today);


            $isToday =
                $date->isSameDay($today);



            /*
            |--------------------------------------------------------------------------
            | Completion Rate
            |--------------------------------------------------------------------------
            */


            $completionRate =
                $totalHabitsForDay > 0

                ? round(
                    (
                        $completedCount
                        /
                        $totalHabitsForDay
                    )
                    * 100
                )

                : 0;



            /*
            |--------------------------------------------------------------------------
            | Day Status
            |--------------------------------------------------------------------------
            */


            if ($isFuture) {

                $status = 'future';

            }

            elseif ($totalHabitsForDay === 0) {

                $status = 'no_habits';

            }

            elseif (
                $completedCount
                >=
                $totalHabitsForDay
            ) {

                $status = 'completed';

                $completedDays++;

            }

            elseif ($completedCount > 0) {

                $status = 'partial';

                $partialDays++;

            }

            elseif ($isToday) {

                $status = 'pending';

            }

            else {

                $status = 'missed';

                $missedDays++;

            }



            /*
            |--------------------------------------------------------------------------
            | Heatmap Intensity
            |--------------------------------------------------------------------------
            */


            $intensity = 0;


            if ($completionRate >= 100) {

                $intensity = 4;

            }

            elseif ($completionRate >= 75) {

                $intensity = 3;

            }

            elseif ($completionRate >= 50) {

                $intensity = 2;

            }

            elseif ($completionRate > 0) {

                $intensity = 1;

            }



            /*
            |--------------------------------------------------------------------------
            | Monthly Summary
            |--------------------------------------------------------------------------
            */


            if (!$isFuture) {

                $totalCompletions +=
                    $completedCount;


                $possibleCompletions +=
                    $totalHabitsForDay;


                if (
                    $totalHabitsForDay > 0
                    &&
                    $completionRate > $bestRate
                ) {

                    $bestRate =
                        $completionRate;


                    $bestDay = [
                        'date' =>
                            $dateString,

                        'completion_rate' =>
                            $completionRate,

                        'completed_count' =>
                            $completedCount,

                        'total_habits' =>
                            $totalHabitsForDay,
                    ];

                }

            }



            $days[] = [

                'date' =>
                    $dateString,

                'day' =>
                    $dayNumber,

                'weekday' =>
                    $date->isoWeekday(),

                'completed_count' =>
                    $completedCount,

                'total_habits' =>
                    $totalHabitsForDay,

                'completion_rate' =>
                    $completionRate,

                'status' =>
                    $status,

                'intensity' =>
                    $intensity,

                'is_today' =>
                    $isToday,

                'is_future' =>
                    $isFuture,

            ];

        }



        /*
        |--------------------------------------------------------------------------
        | Monthly Completion Rate
        |--------------------------------------------------------------------------
        */


        $monthlyRate =
            $possibleCompletions > 0

            ? round(
                (
                    $totalCompletions
                    /
                    $possibleCompletions
                )
                * 100
            )

            : 0;



        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */


        return response()->json([

            'month' =>
                $start->format('Y-m'),

            'year' =>
                (int) $start->year,

            'month_number' =>
                (int) $start->month,

            'days_in_month' =>
                $start->daysInMonth,

            'first_weekday' =>
                $start->isoWeekday(),

            'days' =>
                $days,

            'summary' => [

                'total_completions' =>
                    $totalCompletions,

                'possible_completions' =>
                    $possibleCompletions,

                'completion_rate' =>
                    $monthlyRate,

                'completed_days' =>
                    $completedDays,

                'partial_days' =>
                    $partialDays,

                'missed_days' =>
                    $missedDays,

                'best_day' =>
                    $bestDay,

            ],

        ]);
    }
}