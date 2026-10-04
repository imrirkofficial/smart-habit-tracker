<?php

namespace App\Services;

use App\Models\HabitLog;
use App\Models\User;

class AchievementService
{
    /*
    |--------------------------------------------------------------------------
    | Achievement Definitions
    |--------------------------------------------------------------------------
    */

    public function definitions(): array
    {
        return [

            [
                'code' =>
                    'first_step',

                'title' =>
                    'First Step',

                'title_bn' =>
                    'প্রথম পদক্ষেপ',

                'description' =>
                    'Complete your first habit.',

                'description_bn' =>
                    'আপনার প্রথম habit সম্পন্ন করুন।',

                'badge' =>
                    '🌱',

                'type' =>
                    'completions',

                'target' =>
                    1,

                'reward_xp' =>
                    25,

                'reward_coins' =>
                    5,
            ],


            [
                'code' =>
                    'momentum_maker',

                'title' =>
                    'Momentum Maker',

                'title_bn' =>
                    'মোমেন্টাম মেকার',

                'description' =>
                    'Complete habits 10 times.',

                'description_bn' =>
                    '১০টি habit completion সম্পন্ন করুন।',

                'badge' =>
                    '⚡',

                'type' =>
                    'completions',

                'target' =>
                    10,

                'reward_xp' =>
                    50,

                'reward_coins' =>
                    10,
            ],


            [
                'code' =>
                    'consistency_warrior',

                'title' =>
                    'Consistency Warrior',

                'title_bn' =>
                    'কনসিস্টেন্সি ওয়ারিয়র',

                'description' =>
                    'Reach a 7-day habit streak.',

                'description_bn' =>
                    '৭ দিনের habit streak অর্জন করুন।',

                'badge' =>
                    '🔥',

                'type' =>
                    'longest_streak',

                'target' =>
                    7,

                'reward_xp' =>
                    100,

                'reward_coins' =>
                    25,
            ],


            [
                'code' =>
                    'habit_builder',

                'title' =>
                    'Habit Builder',

                'title_bn' =>
                    'হ্যাবিট বিল্ডার',

                'description' =>
                    'Create 5 habits.',

                'description_bn' =>
                    '৫টি habit তৈরি করুন।',

                'badge' =>
                    '🎯',

                'type' =>
                    'habits',

                'target' =>
                    5,

                'reward_xp' =>
                    75,

                'reward_coins' =>
                    20,
            ],


            [
                'code' =>
                    'goal_getter',

                'title' =>
                    'Goal Getter',

                'title_bn' =>
                    'গোল গেটার',

                'description' =>
                    'Complete your first goal.',

                'description_bn' =>
                    'আপনার প্রথম goal সম্পন্ন করুন।',

                'badge' =>
                    '🏅',

                'type' =>
                    'completed_goals',

                'target' =>
                    1,

                'reward_xp' =>
                    100,

                'reward_coins' =>
                    25,
            ],


            [
                'code' =>
                    'century_club',

                'title' =>
                    'Century Club',

                'title_bn' =>
                    'সেঞ্চুরি ক্লাব',

                'description' =>
                    'Reach 100 habit completions.',

                'description_bn' =>
                    '১০০টি habit completion অর্জন করুন।',

                'badge' =>
                    '💯',

                'type' =>
                    'completions',

                'target' =>
                    100,

                'reward_xp' =>
                    200,

                'reward_coins' =>
                    50,
            ],


            [
                'code' =>
                    'thirty_day_legend',

                'title' =>
                    '30 Day Legend',

                'title_bn' =>
                    '৩০ দিনের লিজেন্ড',

                'description' =>
                    'Reach a 30-day habit streak.',

                'description_bn' =>
                    '৩০ দিনের habit streak অর্জন করুন।',

                'badge' =>
                    '👑',

                'type' =>
                    'longest_streak',

                'target' =>
                    30,

                'reward_xp' =>
                    300,

                'reward_coins' =>
                    100,
            ],

        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Evaluate Achievements
    |--------------------------------------------------------------------------
    */

    public function evaluateAndUnlock(
        User $user
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Current User Metrics
        |--------------------------------------------------------------------------
        */

        $metrics =
            $this->getMetrics(
                $user
            );


        $newlyUnlocked = [];

        $achievementXp = 0;

        $achievementCoins = 0;


        /*
        |--------------------------------------------------------------------------
        | Check Every Achievement
        |--------------------------------------------------------------------------
        */

        foreach (
            $this->definitions()
            as $definition
        ) {

            /*
            Existing schema has no code column,
            so title is used as the stable key.
            */

            $achievement =
                $user
                    ->achievements()
                    ->firstOrCreate(

                        [
                            'title' =>
                                $definition[
                                    'title'
                                ],
                        ],

                        [
                            'description' =>
                                $definition[
                                    'description'
                                ],

                            'badge' =>
                                $definition[
                                    'badge'
                                ],

                            'unlocked' =>
                                false,

                            'unlocked_at' =>
                                null,
                        ]

                    );


            /*
            Keep content updated if definitions change.
            */

            $achievement->description =
                $definition[
                    'description'
                ];


            $achievement->badge =
                $definition[
                    'badge'
                ];


            $achievement->save();


            $currentValue =
                $metrics[
                    $definition[
                        'type'
                    ]
                ]
                ?? 0;


            /*
            |--------------------------------------------------------------------------
            | Unlock
            |--------------------------------------------------------------------------
            */

            if (
                !$achievement->unlocked
                &&
                $currentValue
                    >=
                $definition['target']
            ) {

                $achievement->unlocked =
                    true;


                $achievement->unlocked_at =
                    now();


                $achievement->save();


                $achievementXp +=
                    $definition[
                        'reward_xp'
                    ];


                $achievementCoins +=
                    $definition[
                        'reward_coins'
                    ];


                $newlyUnlocked[] = [

                    'id' =>
                        $achievement->id,

                    'code' =>
                        $definition[
                            'code'
                        ],

                    'title' =>
                        $definition[
                            'title'
                        ],

                    'title_bn' =>
                        $definition[
                            'title_bn'
                        ],

                    'description' =>
                        $definition[
                            'description'
                        ],

                    'description_bn' =>
                        $definition[
                            'description_bn'
                        ],

                    'badge' =>
                        $definition[
                            'badge'
                        ],

                    'reward_xp' =>
                        $definition[
                            'reward_xp'
                        ],

                    'reward_coins' =>
                        $definition[
                            'reward_coins'
                        ],

                ];

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Apply Achievement Rewards
        |--------------------------------------------------------------------------
        */

        if (
            $achievementXp > 0
            ||
            $achievementCoins > 0
        ) {

            $user->xp =
                (
                    $user->xp
                    ?? 0
                )
                +
                $achievementXp;


            $user->coins =
                (
                    $user->coins
                    ?? 0
                )
                +
                $achievementCoins;


            /*
            Every 100 XP = next level.
            */

            $user->level =
                floor(
                    $user->xp
                    /
                    100
                )
                +
                1;


            $user->save();

        }


        return [

            'newly_unlocked' =>
                $newlyUnlocked,

            'reward_xp' =>
                $achievementXp,

            'reward_coins' =>
                $achievementCoins,

        ];
    }


    /*
    |--------------------------------------------------------------------------
    | Achievement List With Progress
    |--------------------------------------------------------------------------
    */

    public function listForUser(
        User $user
    ): array {

        /*
        Evaluate first so old users can
        unlock achievements automatically.
        */

        $unlockResult =
            $this->evaluateAndUnlock(
                $user
            );


        $metrics =
            $this->getMetrics(
                $user
            );


        $items = [];


        foreach (
            $this->definitions()
            as $definition
        ) {

            $achievement =
                $user
                    ->achievements()
                    ->where(
                        'title',
                        $definition['title']
                    )
                    ->first();


            $current =
                (int) (
                    $metrics[
                        $definition[
                            'type'
                        ]
                    ]
                    ?? 0
                );


            $target =
                (int) $definition[
                    'target'
                ];


            $progress =
                $target > 0

                ? min(
                    100,
                    round(
                        (
                            $current
                            /
                            $target
                        )
                        * 100
                    )
                )

                : 0;


            $items[] = [

                'id' =>
                    $achievement?->id,

                'code' =>
                    $definition[
                        'code'
                    ],

                'title' =>
                    $definition[
                        'title'
                    ],

                'title_bn' =>
                    $definition[
                        'title_bn'
                    ],

                'description' =>
                    $definition[
                        'description'
                    ],

                'description_bn' =>
                    $definition[
                        'description_bn'
                    ],

                'badge' =>
                    $definition[
                        'badge'
                    ],

                'unlocked' =>
                    (bool) (
                        $achievement
                            ?->unlocked
                        ?? false
                    ),

                'unlocked_at' =>
                    $achievement
                        ?->unlocked_at
                        ?->toISOString(),

                'current' =>
                    min(
                        $current,
                        $target
                    ),

                'target' =>
                    $target,

                'progress' =>
                    $progress,

                'reward_xp' =>
                    $definition[
                        'reward_xp'
                    ],

                'reward_coins' =>
                    $definition[
                        'reward_coins'
                    ],

            ];

        }


        return [

            'achievements' =>
                $items,

            'newly_unlocked' =>
                $unlockResult[
                    'newly_unlocked'
                ],

            'reward_xp' =>
                $unlockResult[
                    'reward_xp'
                ],

            'reward_coins' =>
                $unlockResult[
                    'reward_coins'
                ],

        ];
    }


    /*
    |--------------------------------------------------------------------------
    | User Metrics
    |--------------------------------------------------------------------------
    */

    private function getMetrics(
        User $user
    ): array {

        $habitIds =
            $user
                ->habits()
                ->pluck('id');


        $completionCount = 0;


        if (
            $habitIds->isNotEmpty()
        ) {

            $completionCount =
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


        return [

            'completions' =>
                $completionCount,

            'habits' =>
                $user
                    ->habits()
                    ->count(),

            'completed_goals' =>
                $user
                    ->goals()
                    ->where(
                        'status',
                        'completed'
                    )
                    ->count(),

            'current_streak' =>
                (int) (
                    $user
                        ->current_streak
                    ?? 0
                ),

            'longest_streak' =>
                (int) (
                    $user
                        ->longest_streak
                    ?? 0
                ),

        ];
    }
}