<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIChatController extends Controller
{
    /**
     * Free Smart Habit Coach
     *
     * No OpenAI
     * No Gemini
     * No paid API
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => [
                'required',
                'string',
                'max:1500',
            ],

            'language' => [
                'nullable',
                'string',
                'in:en,bn',
            ],

            'history' => [
                'nullable',
                'array',
            ],
        ]);


        $user = $request->user();


        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }


        $message = trim(
            strtolower(
                $validated['message']
            )
        );


        $language =
            $validated['language']
            ?? $user->language
            ?? 'en';


        /*
        |--------------------------------------------------------------------------
        | Load User Habit Data
        |--------------------------------------------------------------------------
        */

        $habits = $user
            ->habits()
            ->with('logs')
            ->get();


        $totalHabits =
            $habits->count();


        $allLogs =
            $habits->flatMap(
                function ($habit) {
                    return $habit->logs;
                }
            );


        $completedLogs =
            $allLogs->filter(
                function ($log) {
                    return (bool) $log->completed;
                }
            );


        $totalCompleted =
            $completedLogs->count();


        /*
        |--------------------------------------------------------------------------
        | Today Completed
        |--------------------------------------------------------------------------
        */

        $today =
            now()->toDateString();


        $completedToday =
            $completedLogs
                ->filter(
                    function ($log) use ($today) {

                        if (!$log->completed_date) {
                            return false;
                        }


                        return
                            $log->completed_date
                                ->toDateString()
                            === $today;

                    }
                )
                ->count();


        /*
        |--------------------------------------------------------------------------
        | Last 7 Days
        |--------------------------------------------------------------------------
        */

        $sevenDaysAgo =
            now()
                ->subDays(6)
                ->startOfDay();


        $last7DaysCompleted =
            $completedLogs
                ->filter(
                    function ($log) use ($sevenDaysAgo) {

                        if (!$log->completed_date) {
                            return false;
                        }


                        return
                            $log->completed_date
                                ->greaterThanOrEqualTo(
                                    $sevenDaysAgo
                                );

                    }
                )
                ->count();


        /*
        |--------------------------------------------------------------------------
        | Active Days
        |--------------------------------------------------------------------------
        */

        $activeDays =
            $completedLogs
                ->map(
                    function ($log) {

                        if (!$log->completed_date) {
                            return null;
                        }


                        return
                            $log->completed_date
                                ->toDateString();

                    }
                )
                ->filter()
                ->unique()
                ->count();


        /*
        |--------------------------------------------------------------------------
        | User Stats
        |--------------------------------------------------------------------------
        */

        $xp =
            $user->xp ?? 0;


        $level =
            $user->level ?? 1;


        $coins =
            $user->coins ?? 0;


        $currentStreak =
            $user->current_streak ?? 0;


        $longestStreak =
            $user->longest_streak ?? 0;


        /*
        |--------------------------------------------------------------------------
        | Goals
        |--------------------------------------------------------------------------
        */

        $activeGoals =
            $user
                ->goals()
                ->where(
                    'status',
                    'active'
                )
                ->get();


        /*
        |--------------------------------------------------------------------------
        | Generate Free Coach Reply
        |--------------------------------------------------------------------------
        */

        $reply =
            $this->generateReply(

                message: $message,

                language: $language,

                totalHabits: $totalHabits,

                totalCompleted: $totalCompleted,

                completedToday: $completedToday,

                last7DaysCompleted: $last7DaysCompleted,

                activeDays: $activeDays,

                currentStreak: $currentStreak,

                longestStreak: $longestStreak,

                xp: $xp,

                level: $level,

                coins: $coins,

                activeGoals: $activeGoals

            );


        return response()->json([
            'reply' => $reply,

            'engine' =>
                'smart-rule-based-coach',

            'free' =>
                true,
        ]);
    }



    /*
    |--------------------------------------------------------------------------
    | Rule Based Coach Engine
    |--------------------------------------------------------------------------
    */

    private function generateReply(
        string $message,
        string $language,
        int $totalHabits,
        int $totalCompleted,
        int $completedToday,
        int $last7DaysCompleted,
        int $activeDays,
        int $currentStreak,
        int $longestStreak,
        int $xp,
        int $level,
        int $coins,
        $activeGoals
    ): string {


        $bangla =
            $language === 'bn';


        /*
        |--------------------------------------------------------------------------
        | No Habits
        |--------------------------------------------------------------------------
        */

        if ($totalHabits === 0) {

            return $bangla

                ? "আপনি এখনও কোনো habit তৈরি করেননি। 🌱 প্রথমে একটি সহজ habit দিয়ে শুরু করুন—যেমন প্রতিদিন ১০ মিনিট বই পড়া বা ১৫ মিনিট হাঁটা। ছোট লক্ষ্য দিয়ে শুরু করলে consistency তৈরি করা সহজ হবে।"

                : "You have not created any habits yet. 🌱 Start with one simple habit, such as reading for 10 minutes or walking for 15 minutes every day. Small goals are easier to maintain consistently.";
        }



        /*
        |--------------------------------------------------------------------------
        | Streak Questions
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'streak'
            )
            ||
            str_contains(
                $message,
                'ধারাবাহিক'
            )
            ||
            str_contains(
                $message,
                'স্ট্রিক'
            )
        ) {

            return $bangla

                ? "🔥 আপনার বর্তমান streak {$currentStreak} দিন এবং সর্বোচ্চ streak {$longestStreak} দিন। আজ {$completedToday}টি habit complete করেছেন। streak ধরে রাখতে আজকের বাকি habitগুলোও সম্পন্ন করার চেষ্টা করুন।"

                : "🔥 Your current streak is {$currentStreak} days, and your longest streak is {$longestStreak} days. You have completed {$completedToday} habit(s) today. Finish your remaining habits today to protect your streak.";
        }



        /*
        |--------------------------------------------------------------------------
        | XP / Level Questions
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'xp'
            )
            ||
            str_contains(
                $message,
                'level'
            )
            ||
            str_contains(
                $message,
                'coin'
            )
            ||
            str_contains(
                $message,
                'লেভেল'
            )
            ||
            str_contains(
                $message,
                'এক্সপি'
            )
            ||
            str_contains(
                $message,
                'কয়েন'
            )
        ) {

            return $bangla

                ? "🎮 আপনি এখন Level {$level}-এ আছেন। আপনার XP {$xp} এবং coins {$coins}। Habit complete করতে থাকলে XP ও coins বাড়বে এবং নতুন level অর্জন করতে পারবেন।"

                : "🎮 You are currently Level {$level}. You have {$xp} XP and {$coins} coins. Keep completing your habits to earn more XP, coins, and higher levels.";
        }



        /*
        |--------------------------------------------------------------------------
        | Goal Questions
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'goal'
            )
            ||
            str_contains(
                $message,
                'target'
            )
            ||
            str_contains(
                $message,
                'লক্ষ্য'
            )
        ) {

            $goalCount =
                $activeGoals->count();


            if ($goalCount === 0) {

                return $bangla

                    ? "🎯 বর্তমানে আপনার কোনো active goal নেই। একটি measurable goal তৈরি করতে পারেন—যেমন '৩০ দিনে ২০ দিন exercise করা'।"

                    : "🎯 You currently have no active goals. Try creating a measurable goal, such as completing exercise on 20 days during the next 30 days.";
            }


            $firstGoal =
                $activeGoals->first();


            return $bangla

                ? "🎯 আপনার {$goalCount}টি active goal আছে। বর্তমানে '{$firstGoal->title}' goal-এর progress প্রায় {$firstGoal->progress}%। বড় goal-কে ছোট daily habit-এ ভাগ করলে progress ধরে রাখা সহজ হবে।"

                : "🎯 You have {$goalCount} active goal(s). Your '{$firstGoal->title}' goal is currently around {$firstGoal->progress}% complete. Breaking a large goal into small daily habits can make it easier to maintain progress.";
        }



        /*
        |--------------------------------------------------------------------------
        | Motivation
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'motivation'
            )
            ||
            str_contains(
                $message,
                'lazy'
            )
            ||
            str_contains(
                $message,
                'give up'
            )
            ||
            str_contains(
                $message,
                'motivated'
            )
            ||
            str_contains(
                $message,
                'মোটিভেশন'
            )
            ||
            str_contains(
                $message,
                'আলস'
            )
            ||
            str_contains(
                $message,
                'ইচ্ছা'
            )
        ) {

            if ($currentStreak > 0) {

                return $bangla

                    ? "🌱 Motivation সবদিন একই থাকবে না। কিন্তু আপনার ইতোমধ্যে {$currentStreak} দিনের streak আছে—এটা প্রমাণ করে আপনি consistency তৈরি করছেন। আজ পুরো habit করতে ইচ্ছা না হলে minimum version করুন, যেমন ৩০ মিনিটের বদলে ৫ মিনিট।"

                    : "🌱 Motivation will not be equally strong every day, but your {$currentStreak}-day streak shows that you are already building consistency. On difficult days, do the minimum version of the habit—for example, 5 minutes instead of 30.";
            }


            return $bangla

                ? "🌱 Motivation-এর অপেক্ষা না করে habit ছোট করুন। আজ শুধু ৫ মিনিট দিয়ে শুরু করুন। শুরু করাটাই সবচেয়ে গুরুত্বপূর্ণ; ছোট success পরবর্তী কাজ সহজ করে।"

                : "🌱 Instead of waiting for motivation, make the habit smaller. Start with just 5 minutes today. Starting matters more than doing everything perfectly.";
        }



        /*
        |--------------------------------------------------------------------------
        | Missed / Failure Questions
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'miss'
            )
            ||
            str_contains(
                $message,
                'fail'
            )
            ||
            str_contains(
                $message,
                'skip'
            )
            ||
            str_contains(
                $message,
                'মিস'
            )
            ||
            str_contains(
                $message,
                'বাদ'
            )
        ) {

            return $bangla

                ? "একদিন habit miss হওয়া বড় সমস্যা নয়। গুরুত্বপূর্ণ হলো পরের দিন আবার শুরু করা। আপনার লক্ষ্য হওয়া উচিত 'never miss twice'—আজ ছোট version হলেও habit complete করার চেষ্টা করুন।"

                : "Missing a habit once is not a major problem. The important thing is restarting the next day. Use the 'never miss twice' rule and complete even a small version of the habit today.";
        }



        /*
        |--------------------------------------------------------------------------
        | Progress Questions
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'progress'
            )
            ||
            str_contains(
                $message,
                'doing'
            )
            ||
            str_contains(
                $message,
                'performance'
            )
            ||
            str_contains(
                $message,
                'how am i'
            )
            ||
            str_contains(
                $message,
                'অগ্রগতি'
            )
            ||
            str_contains(
                $message,
                'কেমন'
            )
        ) {

            return $bangla

                ? "📊 আপনার বর্তমানে {$totalHabits}টি habit আছে। মোট {$totalCompleted}টি completion record আছে এবং গত ৭ দিনে {$last7DaysCompleted}টি habit completion করেছেন। আপনার current streak {$currentStreak} দিন। নিয়মিত ছোট improvement ধরে রাখাই এখন সবচেয়ে গুরুত্বপূর্ণ।"

                : "📊 You currently have {$totalHabits} habit(s) and {$totalCompleted} recorded completions. During the last 7 days, you completed habits {$last7DaysCompleted} times. Your current streak is {$currentStreak} days. Your next priority should be maintaining small, consistent improvements.";
        }



        /*
        |--------------------------------------------------------------------------
        | Today
        |--------------------------------------------------------------------------
        */

        if (
            str_contains(
                $message,
                'today'
            )
            ||
            str_contains(
                $message,
                'আজ'
            )
        ) {

            return $bangla

                ? "📅 আজ আপনি {$completedToday}টি habit complete করেছেন। আপনার মোট {$totalHabits}টি habit আছে। যেগুলো বাকি আছে সেগুলোর মধ্যে সবচেয়ে সহজ habitটি আগে complete করুন—momentum তৈরি হবে।"

                : "📅 You have completed {$completedToday} habit(s) today out of {$totalHabits} total habits. Start with the easiest remaining habit to build momentum.";
        }



        /*
        |--------------------------------------------------------------------------
        | Greeting
        |--------------------------------------------------------------------------
        */

        if (
            in_array(
                $message,
                [
                    'hi',
                    'hello',
                    'hey',
                    'হাই',
                    'হ্যালো'
                ],
                true
            )
        ) {

            return $bangla

                ? "হ্যালো! 👋 আমি আপনার Smart Habit Coach। আপনার habit, streak, XP, goal এবং progress সম্পর্কে আমাকে জিজ্ঞাসা করতে পারেন।"

                : "Hello! 👋 I am your Smart Habit Coach. You can ask me about your habits, streak, XP, goals, motivation, or progress.";
        }



        /*
        |--------------------------------------------------------------------------
        | Default Personalized Response
        |--------------------------------------------------------------------------
        */

        if ($completedToday > 0) {

            return $bangla

                ? "🌱 ভালো কাজ করছেন! আজ ইতোমধ্যে {$completedToday}টি habit complete করেছেন। আপনার current streak {$currentStreak} দিন এবং Level {$level}-এ {$xp} XP আছে। আরও consistency চাইলে আজকের সবচেয়ে গুরুত্বপূর্ণ বাকি habitটি এখনই complete করুন।"

                : "🌱 You're making progress! You have already completed {$completedToday} habit(s) today. Your current streak is {$currentStreak} days, and you are Level {$level} with {$xp} XP. For better consistency, complete your most important remaining habit next.";
        }


        return $bangla

            ? "🌱 আপনার {$totalHabits}টি active habit আছে এবং current streak {$currentStreak} দিন। আজ এখনও কোনো habit completion record নেই। সবচেয়ে সহজ habitটি দিয়ে শুরু করুন—একটি ছোট completion-ই momentum তৈরি করতে পারে।"

            : "🌱 You have {$totalHabits} active habit(s) and a current streak of {$currentStreak} days. You have not recorded a completion today yet. Start with the easiest habit—a small win can create momentum.";
    }
}