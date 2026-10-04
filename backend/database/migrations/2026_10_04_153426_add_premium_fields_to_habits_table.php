<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('habits', function (Blueprint $table) {

            $table
                ->string('emoji', 20)
                ->default('🌱');

            $table
                ->string('color', 20)
                ->default('#16A34A');

            $table
                ->boolean('reminder_enabled')
                ->default(false);

            $table
                ->unsignedTinyInteger('reminder_hour')
                ->nullable();

            $table
                ->unsignedTinyInteger('reminder_minute')
                ->nullable();

        });
    }


    public function down(): void
    {
        Schema::table('habits', function (Blueprint $table) {

            $table->dropColumn([
                'emoji',
                'color',
                'reminder_enabled',
                'reminder_hour',
                'reminder_minute',
            ]);

        });
    }
};