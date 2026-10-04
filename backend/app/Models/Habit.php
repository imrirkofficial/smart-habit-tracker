<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    use HasFactory;


    /*
    |--------------------------------------------------------------------------
    | Mass Assignable Fields
    |--------------------------------------------------------------------------
    */

    protected $fillable = [

        'user_id',

        'category_id',

        'title',

        'description',

        'frequency',

        'target',

        'emoji',

        'color',

        'reminder_enabled',

        'reminder_hour',

        'reminder_minute',

    ];


    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [

        'target' => 'integer',

        'reminder_enabled' => 'boolean',

        'reminder_hour' => 'integer',

        'reminder_minute' => 'integer',

    ];


    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */


    // Habit belongs to User

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    // Habit belongs to Category

    public function category()
    {
        return $this->belongsTo(HabitCategory::class);
    }


    // Habit has many Logs

    public function logs()
    {
        return $this->hasMany(HabitLog::class);
    }
}