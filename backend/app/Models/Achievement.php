<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Achievement extends Model
{

    use HasFactory;


    protected $fillable = [

        'user_id',
        'title',
        'description',
        'badge',
        'unlocked',
        'unlocked_at'

    ];



    protected $casts = [

        'unlocked' => 'boolean',
        'unlocked_at' => 'datetime'

    ];



    /**
     * Achievement belongs to User
     */

    public function user()
    {

        return $this->belongsTo(User::class);

    }


}