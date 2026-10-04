<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AchievementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function __construct(
        private AchievementService $achievementService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | Achievement List
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): JsonResponse {

        $user =
            $request->user();


        if (!$user) {

            return response()->json([
                'message' =>
                    'Unauthenticated.',
            ], 401);

        }


        $result =
            $this
                ->achievementService
                ->listForUser(
                    $user
                );


        $items =
            collect(
                $result[
                    'achievements'
                ]
            );


        return response()->json([

            'total' =>
                $items->count(),

            'unlocked' =>
                $items
                    ->where(
                        'unlocked',
                        true
                    )
                    ->count(),

            'locked' =>
                $items
                    ->where(
                        'unlocked',
                        false
                    )
                    ->count(),

            'achievements' =>
                $items->values(),

            'newly_unlocked' =>
                $result[
                    'newly_unlocked'
                ],

            'reward' => [

                'xp' =>
                    $result[
                        'reward_xp'
                    ],

                'coins' =>
                    $result[
                        'reward_coins'
                    ],

            ],

        ]);
    }
}