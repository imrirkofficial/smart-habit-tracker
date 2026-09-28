<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{

    public function up(): void
    {

        Schema::table('users', function (Blueprint $table) {


            $table->integer('xp')
                  ->default(0)
                  ->after('password');


            $table->integer('level')
                  ->default(1)
                  ->after('xp');


            $table->integer('coins')
                  ->default(0)
                  ->after('level');


            $table->integer('current_streak')
                  ->default(0)
                  ->after('coins');


            $table->integer('longest_streak')
                  ->default(0)
                  ->after('current_streak');


            // Language support

            $table->string('language')
                  ->default('en')
                  ->after('longest_streak');


        });

    }



    public function down(): void
    {

        Schema::table('users', function (Blueprint $table) {


            $table->dropColumn([
                'xp',
                'level',
                'coins',
                'current_streak',
                'longest_streak',
                'language'
            ]);


        });

    }

};