<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HabitLog;


class AnalyticsController extends Controller
{


public function index(Request $request)
{


$user=$request->user();


$totalHabits=$user->habits()->count();



$completedToday=HabitLog::whereHas(
'habit',
function($q)use($user){

$q->where('user_id',$user->id);

})
->whereDate(
'completed_date',
today()
)
->where('completed',true)
->count();



$totalLogs=HabitLog::whereHas(
'habit',
function($q)use($user){

$q->where('user_id',$user->id);

})
->count();



$completedLogs=HabitLog::whereHas(
'habit',
function($q)use($user){

$q->where('user_id',$user->id);

})
->where('completed',true)
->count();



$rate=$totalLogs?
round(($completedLogs/$totalLogs)*100):0;



return response()->json([

"total_habits"=>$totalHabits,

"completed_today"=>$completedToday,

"completion_rate"=>$rate

]);


}


}