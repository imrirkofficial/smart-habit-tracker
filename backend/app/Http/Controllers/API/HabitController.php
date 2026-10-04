<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Habit List
    |--------------------------------------------------------------------------
    |
    | GET /api/habits
    |
    */

    public function index(Request $request): JsonResponse
    {
        $user =
            $request->user();


        $habits =
            $user
                ->habits()
                ->with('category')
                ->latest()
                ->get();


        return response()->json(
            $habits
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Habit
    |--------------------------------------------------------------------------
    |
    | POST /api/habits
    |
    */

    public function store(Request $request): JsonResponse
    {
        $validated =
            $request->validate([

                'title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],

                'frequency' => [
                    'required',
                    'string',
                    'in:daily,weekly,monthly',
                ],

                'target' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:1440',
                ],

                'category_id' => [
                    'nullable',
                    'integer',
                    'exists:habit_categories,id',
                ],

                'emoji' => [
                    'nullable',
                    'string',
                    'max:20',
                ],

                'color' => [
                    'nullable',
                    'string',
                    'max:20',
                ],

                'reminder_enabled' => [
                    'nullable',
                    'boolean',
                ],

                'reminder_hour' => [
                    'nullable',
                    'integer',
                    'between:0,23',
                ],

                'reminder_minute' => [
                    'nullable',
                    'integer',
                    'between:0,59',
                ],

            ]);


        /*
        |--------------------------------------------------------------------------
        | Default Values
        |--------------------------------------------------------------------------
        */

        $validated['emoji'] =
            $validated['emoji']
            ?? '🌱';


        $validated['color'] =
            $validated['color']
            ?? '#16A34A';


        $validated['reminder_enabled'] =
            $validated['reminder_enabled']
            ?? false;


        /*
        |--------------------------------------------------------------------------
        | Disable Reminder Time When Reminder Is Off
        |--------------------------------------------------------------------------
        */

        if (
            !$validated[
                'reminder_enabled'
            ]
        ) {

            $validated['reminder_hour'] =
                null;


            $validated['reminder_minute'] =
                null;

        }


        /*
        |--------------------------------------------------------------------------
        | Validate Reminder Time
        |--------------------------------------------------------------------------
        */

        if (
            $validated[
                'reminder_enabled'
            ]
            &&
            (
                !isset(
                    $validated[
                        'reminder_hour'
                    ]
                )
                ||
                !isset(
                    $validated[
                        'reminder_minute'
                    ]
                )
            )
        ) {

            return response()->json([

                'message' =>
                    'Reminder time is required when reminder is enabled.',

            ], 422);

        }


        /*
        |--------------------------------------------------------------------------
        | Create Habit
        |--------------------------------------------------------------------------
        */

        $habit =
            $request
                ->user()
                ->habits()
                ->create(
                    $validated
                );


        return response()->json([

            'message' =>
                'Habit created successfully.',

            'habit' =>
                $habit->load(
                    'category'
                ),

        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Habit
    |--------------------------------------------------------------------------
    |
    | GET /api/habits/{habit}
    |
    */

    public function show(
        Request $request,
        Habit $habit
    ): JsonResponse {

        if (
            $habit->user_id
            !==
            $request->user()->id
        ) {

            return response()->json([

                'message' =>
                    'Habit not found.',

            ], 404);

        }


        return response()->json(
            $habit->load([
                'category',
                'logs',
            ])
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Habit
    |--------------------------------------------------------------------------
    |
    | PUT/PATCH /api/habits/{habit}
    |
    */

    public function update(
        Request $request,
        Habit $habit
    ): JsonResponse {

        if (
            $habit->user_id
            !==
            $request->user()->id
        ) {

            return response()->json([

                'message' =>
                    'Habit not found.',

            ], 404);

        }


        $validated =
            $request->validate([

                'title' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'sometimes',
                    'nullable',
                    'string',
                    'max:1000',
                ],

                'frequency' => [
                    'sometimes',
                    'required',
                    'string',
                    'in:daily,weekly,monthly',
                ],

                'target' => [
                    'sometimes',
                    'required',
                    'integer',
                    'min:1',
                    'max:1440',
                ],

                'category_id' => [
                    'sometimes',
                    'nullable',
                    'integer',
                    'exists:habit_categories,id',
                ],

                'emoji' => [
                    'sometimes',
                    'nullable',
                    'string',
                    'max:20',
                ],

                'color' => [
                    'sometimes',
                    'nullable',
                    'string',
                    'max:20',
                ],

                'reminder_enabled' => [
                    'sometimes',
                    'boolean',
                ],

                'reminder_hour' => [
                    'sometimes',
                    'nullable',
                    'integer',
                    'between:0,23',
                ],

                'reminder_minute' => [
                    'sometimes',
                    'nullable',
                    'integer',
                    'between:0,59',
                ],

            ]);


        /*
        |--------------------------------------------------------------------------
        | Reminder Handling
        |--------------------------------------------------------------------------
        */

        $reminderEnabled =
            array_key_exists(
                'reminder_enabled',
                $validated
            )
            ?
            $validated[
                'reminder_enabled'
            ]
            :
            $habit
                ->reminder_enabled;


        if (!$reminderEnabled) {

            $validated[
                'reminder_hour'
            ] = null;


            $validated[
                'reminder_minute'
            ] = null;

        }


        if ($reminderEnabled) {

            $hour =
                array_key_exists(
                    'reminder_hour',
                    $validated
                )
                ?
                $validated[
                    'reminder_hour'
                ]
                :
                $habit
                    ->reminder_hour;


            $minute =
                array_key_exists(
                    'reminder_minute',
                    $validated
                )
                ?
                $validated[
                    'reminder_minute'
                ]
                :
                $habit
                    ->reminder_minute;


            if (
                $hour === null
                ||
                $minute === null
            ) {

                return response()->json([

                    'message' =>
                        'Reminder time is required when reminder is enabled.',

                ], 422);

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        $habit->update(
            $validated
        );


        return response()->json([

            'message' =>
                'Habit updated successfully.',

            'habit' =>
                $habit
                    ->fresh()
                    ->load(
                        'category'
                    ),

        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Habit
    |--------------------------------------------------------------------------
    |
    | DELETE /api/habits/{habit}
    |
    */

    public function destroy(
        Request $request,
        Habit $habit
    ): JsonResponse {

        if (
            $habit->user_id
            !==
            $request->user()->id
        ) {

            return response()->json([

                'message' =>
                    'Habit not found.',

            ], 404);

        }


        /*
        |--------------------------------------------------------------------------
        | Delete Logs First
        |--------------------------------------------------------------------------
        */

        $habit
            ->logs()
            ->delete();


        /*
        |--------------------------------------------------------------------------
        | Delete Habit
        |--------------------------------------------------------------------------
        */

        $habit->delete();


        return response()->json([

            'message' =>
                'Habit deleted successfully.',

        ]);
    }
}