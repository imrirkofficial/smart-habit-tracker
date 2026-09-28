<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Achievement;

class AchievementController extends Controller
{


public function index(Request $request)
{

return response()->json(
$request->user()->achievements
);

}



public function store(Request $request)
{

$achievement = Achievement::create([

'user_id'=>$request->user()->id,

'title'=>$request->title,

'description'=>$request->description

]);


return response()->json($achievement);

}


}