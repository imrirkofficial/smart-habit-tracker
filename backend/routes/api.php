<?php

use Illuminate\Support\Facades\Route;


// Controllers

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HabitController;
use App\Http\Controllers\API\HabitLogController;
use App\Http\Controllers\API\GoalController;
use App\Http\Controllers\API\AchievementController;
use App\Http\Controllers\API\AnalyticsController;
use App\Http\Controllers\API\CalendarController;
use App\Http\Controllers\API\AIInsightController;
use App\Http\Controllers\API\HabitCompletionController;
use App\Http\Controllers\API\ProfileController;

use App\Http\Controllers\AIChatController;



/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/


Route::post(
    '/register',
    [
        AuthController::class,
        'register'
    ]
);


Route::post(
    '/login',
    [
        AuthController::class,
        'login'
    ]
);



/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
|
| All routes below require a valid Laravel Sanctum token.
|
*/


Route::middleware(
    'auth:sanctum'
)->group(function () {


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */


    Route::post(
        '/logout',
        [
            AuthController::class,
            'logout'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */


    Route::get(
        '/profile',
        [
            ProfileController::class,
            'index'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Habit CRUD
    |--------------------------------------------------------------------------
    */


    Route::apiResource(
        'habits',
        HabitController::class
    );



    /*
    |--------------------------------------------------------------------------
    | Habit Completion Engine
    |--------------------------------------------------------------------------
    |
    | Handles:
    | - Habit completion
    | - XP reward
    | - Coins
    | - Streak update
    |
    */


    Route::post(
        '/habits/{habit}/complete',
        [
            HabitCompletionController::class,
            'complete'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Habit Logs
    |--------------------------------------------------------------------------
    */


    Route::apiResource(
        'habit-logs',
        HabitLogController::class
    );



    /*
    |--------------------------------------------------------------------------
    | Goals
    |--------------------------------------------------------------------------
    */


    Route::apiResource(
        'goals',
        GoalController::class
    );



    /*
    |--------------------------------------------------------------------------
    | Achievements
    |--------------------------------------------------------------------------
    */


    Route::get(
        '/achievements',
        [
            AchievementController::class,
            'index'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    */


    Route::get(
        '/analytics',
        [
            AnalyticsController::class,
            'index'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Calendar Heatmap
    |--------------------------------------------------------------------------
    |
    | Example:
    | GET /api/calendar
    | GET /api/calendar?month=2026-10
    |
    */


    Route::get(
        '/calendar',
        [
            CalendarController::class,
            'index'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Smart Habit Coach - Quick Insight
    |--------------------------------------------------------------------------
    |
    | Existing rule-based insight endpoint.
    |
    */


    Route::get(
        '/ai-insights',
        [
            AIInsightController::class,
            'index'
        ]
    );



    /*
    |--------------------------------------------------------------------------
    | Smart Habit Coach - Chat
    |--------------------------------------------------------------------------
    |
    | 100% free local rule-based coaching.
    | No OpenAI API.
    | No paid external API.
    |
    */


    Route::post(
        '/ai/chat',
        [
            AIChatController::class,
            'chat'
        ]
    )
    ->middleware(
        'throttle:30,1'
    );


});