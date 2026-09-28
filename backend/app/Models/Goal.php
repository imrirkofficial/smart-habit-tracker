<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Goal extends Model
{

    use HasFactory;


    protected $fillable = [

        'user_id',
        'title',
        'description',
        'target_date',
        'progress',
        'status'

    ];



    protected $casts = [

        'target_date' => 'date'

    ];



    /**
     * Goal belongs to User
     */
    public function user()
    {

        return $this->belongsTo(User::class);

    }


}