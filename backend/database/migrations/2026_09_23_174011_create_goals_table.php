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
        Schema::create('goals', function (Blueprint $table) {

            $table->id();


            // User relationship
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();


            // Goal information
            $table->string('title');

            $table->text('description')
                  ->nullable();


            // Goal deadline
            $table->date('target_date')
                  ->nullable();


            // Progress tracking
            $table->integer('progress')
                  ->default(0);


            $table->enum('status', [
                'active',
                'completed',
                'cancelled'
            ])
            ->default('active');


            $table->timestamps();

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};