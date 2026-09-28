<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Habit extends Model
{

    use HasFactory;


    protected $fillable = [

        'user_id',
        'category_id',
        'title',
        'description',
        'frequency',
        'target'

    ];



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



    // Habit has many logs

    public function logs()
    {

        return $this->hasMany(HabitLog::class);

    }


}