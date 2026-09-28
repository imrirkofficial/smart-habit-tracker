<?php

namespace App\Models;


use Database\Factories\UserFactory;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Foundation\Auth\User as Authenticatable;

use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;



#[Fillable([
    'name',
    'email',
    'password',
    'xp',
    'level',
    'coins',
    'current_streak',
    'longest_streak',
    'language'
])]


#[Hidden([
    'password',
    'remember_token'
])]


class User extends Authenticatable
{


    use HasApiTokens, HasFactory, Notifiable;




    /**
     * User has many habits
     */

    public function habits()
    {

        return $this->hasMany(Habit::class);

    }





    /**
     * User has many goals
     */

    public function goals()
    {

        return $this->hasMany(Goal::class);

    }





    /**
     * User has many achievements
     */

    public function achievements()
    {

        return $this->hasMany(Achievement::class);

    }





    /**
     * User XP and Game Stats
     */

    protected function casts(): array
    {

        return [

            'email_verified_at' => 'datetime',

            'password' => 'hashed',


            'xp' => 'integer',

            'level' => 'integer',

            'coins' => 'integer',

            'current_streak' => 'integer',

            'longest_streak' => 'integer',

        ];

    }


}