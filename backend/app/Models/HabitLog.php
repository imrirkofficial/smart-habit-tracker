<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class HabitLog extends Model
{

    use HasFactory;


    protected $fillable = [

        'habit_id',
        'completed_date',
        'completed',
        'duration',
        'mood',
        'difficulty'

    ];



    protected $casts = [

        'completed' => 'boolean',

        'completed_date' => 'date'

    ];



    // Habit relationship

    public function habit()
    {

        return $this->belongsTo(Habit::class);

    }


}