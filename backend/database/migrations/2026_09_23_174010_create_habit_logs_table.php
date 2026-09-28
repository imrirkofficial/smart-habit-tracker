<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{

    public function up(): void
    {

        Schema::create('habit_logs', function (Blueprint $table) {


            $table->id();


            $table->foreignId('habit_id')
                  ->constrained()
                  ->cascadeOnDelete();



            $table->date('completed_date');


            $table->boolean('completed')
                  ->default(true);



            $table->integer('duration')
                  ->nullable();



            $table->enum('mood', [

                'excellent',
                'good',
                'normal',
                'bad'

            ])->nullable();



            $table->enum('difficulty', [

                'easy',
                'medium',
                'hard'

            ])->nullable();



            $table->timestamps();


        });

    }



    public function down(): void
    {

        Schema::dropIfExists('habit_logs');

    }

};