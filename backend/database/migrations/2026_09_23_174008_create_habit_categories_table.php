<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('habit_categories', function (Blueprint $table) {

            $table->id();

            // Category Name
            $table->string('name');

            // Icon name or path
            $table->string('icon')
                  ->nullable();

            // UI color code (#00FF00)
            $table->string('color')
                  ->nullable();

            // Category description
            $table->text('description')
                  ->nullable();


            $table->timestamps();

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habit_categories');
    }
};