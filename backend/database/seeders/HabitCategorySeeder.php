<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HabitCategory;


class HabitCategorySeeder extends Seeder
{

    public function run(): void
    {

        $categories = [

            [
                'name'=>'Health',
                'icon'=>'heart',
                'color'=>'#FF5733',
                'description'=>'Health related habits'
            ],


            [
                'name'=>'Fitness',
                'icon'=>'fitness',
                'color'=>'#28A745',
                'description'=>'Exercise and workout habits'
            ],


            [
                'name'=>'Learning',
                'icon'=>'book',
                'color'=>'#007BFF',
                'description'=>'Study and learning habits'
            ],


            [
                'name'=>'Finance',
                'icon'=>'wallet',
                'color'=>'#FFC107',
                'description'=>'Money management habits'
            ],


            [
                'name'=>'Mindfulness',
                'icon'=>'brain',
                'color'=>'#6F42C1',
                'description'=>'Mental wellness habits'
            ],


            [
                'name'=>'Career',
                'icon'=>'briefcase',
                'color'=>'#343A40',
                'description'=>'Career improvement habits'
            ],


            [
                'name'=>'Personal Growth',
                'icon'=>'growth',
                'color'=>'#17A2B8',
                'description'=>'Self improvement habits'
            ]

        ];


        foreach($categories as $category)
        {

            HabitCategory::create($category);

        }

    }
}