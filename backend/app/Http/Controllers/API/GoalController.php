<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Goal;

class GoalController extends Controller
{

    public function index(Request $request)
    {
        return response()->json(
            $request->user()->goals
        );
    }


    public function store(Request $request)
    {

        $data = $request->validate([
            'title'=>'required',
            'description'=>'nullable',
            'target_date'=>'nullable|date'
        ]);


        $goal = Goal::create([
            'user_id'=>$request->user()->id,
            ...$data
        ]);


        return response()->json($goal);
    }



    public function update(Request $request,$id)
    {

        $goal = Goal::findOrFail($id);

        $goal->update($request->all());

        return response()->json($goal);

    }



    public function destroy($id)
    {

        Goal::destroy($id);

        return response()->json([
            "message"=>"Goal deleted"
        ]);

    }

}