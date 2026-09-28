<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{

    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();


            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('habit_categories')
                  ->nullOnDelete();


            $table->string('title');

            $table->text('description')
                  ->nullable();


            $table->enum('frequency', [
                'daily',
                'weekly',
                'monthly'
            ]);


            $table->integer('target')
                  ->default(1);


            $table->timestamps();

        });
    }



    public function down(): void
    {
        Schema::dropIfExists('habits');
    }

};