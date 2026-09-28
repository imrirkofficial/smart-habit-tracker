<?php

use Illuminate\Support\Facades\Route;


// Controllers

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HabitController;
use App\Http\Controllers\API\HabitLogController;

use App\Http\Controllers\API\GoalController;
use App\Http\Controllers\API\AchievementController;
use App\Http\Controllers\API\AnalyticsController;
use App\Http\Controllers\API\AIInsightController;

use App\Http\Controllers\API\HabitCompletionController;



/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/


Route::post('/register',
    [AuthController::class, 'register']
);


Route::post('/login',
    [AuthController::class, 'login']
);





/*
|--------------------------------------------------------------------------
| Protected Routes
| Require Sanctum Token
|--------------------------------------------------------------------------
*/


Route::middleware('auth:sanctum')->group(function () {



    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */


    Route::post('/logout',
        [AuthController::class, 'logout']
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
    | XP + Streak + Rewards
    |--------------------------------------------------------------------------
    */


    Route::post(
        '/habits/{habit}/complete',
        [HabitCompletionController::class, 'complete']
    );





    /*
    |--------------------------------------------------------------------------
    | Habit Logs CRUD
    |--------------------------------------------------------------------------
    */


    Route::apiResource(
        'habit-logs',
        HabitLogController::class
    );





    /*
    |--------------------------------------------------------------------------
    | Goal CRUD
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
        [AchievementController::class, 'index']
    );





    /*
    |--------------------------------------------------------------------------
    | Analytics Dashboard
    |--------------------------------------------------------------------------
    */


    Route::get(
        '/analytics',
        [AnalyticsController::class, 'index']
    );





    /*
    |--------------------------------------------------------------------------
    | AI Habit Coach Insights
    |--------------------------------------------------------------------------
    */


    Route::get(
        '/ai-insights',
        [AIInsightController::class, 'index']
    );


});