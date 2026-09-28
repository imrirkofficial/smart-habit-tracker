<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {

        Schema::create('achievements', function (Blueprint $table) {

            $table->id();


            // User relation
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();


            // Achievement information
            $table->string('title');

            $table->text('description')
                  ->nullable();


            // Badge type
            $table->string('badge')
                  ->nullable();


            // Achievement status
            $table->boolean('unlocked')
                  ->default(false);


            $table->timestamp('unlocked_at')
                  ->nullable();


            $table->timestamps();

        });

    }


    public function down(): void
    {

        Schema::dropIfExists('achievements');

    }

};