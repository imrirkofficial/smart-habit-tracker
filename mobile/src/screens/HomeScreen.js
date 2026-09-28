import React, {useEffect, useState} from "react";


import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView
} from "react-native";


import api from "../api/api";


import {
removeToken
} from "../storage/token";



export default function HomeScreen({navigation}){


const [analytics,setAnalytics] = useState(null);

const [insight,setInsight] = useState("");

const [habits,setHabits] = useState([]);




useEffect(()=>{


const unsubscribe = navigation.addListener(
"focus",
()=>{

loadData();

}

);


return unsubscribe;


},[navigation]);





const loadData = async()=>{


try{


// Analytics

const analyticsResponse =
await api.get("/analytics");


setAnalytics(
analyticsResponse.data
);



// AI Insight

const insightResponse =
await api.get("/ai-insights");


setInsight(
insightResponse.data.insight
);




// Habits

const habitsResponse =
await api.get("/habits");


setHabits(
habitsResponse.data
);



}

catch(error){


console.log(
"HOME ERROR:",
error.response?.data || error.message
);


}


};





const logout = async()=>{


await removeToken();


navigation.replace("Login");


};





return(


<ScrollView

style={styles.container}

showsVerticalScrollIndicator={false}

>


<Text style={styles.greeting}>

Good Evening, Robin 👋

</Text>





<View style={styles.progressCard}>


<Text style={styles.cardTitle}>

Today's Progress

</Text>



<Text style={styles.percent}>

{analytics?.completion_rate ?? 0}%

</Text>



<Text style={styles.whiteText}>

Consistency Score

</Text>



</View>





<View style={styles.row}>


<View style={styles.smallCard}>


<Text>

🔥

</Text>


<Text style={styles.number}>

{analytics?.total_habits ?? 0}

</Text>


<Text>

Habits

</Text>


</View>





<View style={styles.smallCard}>


<Text>

✅

</Text>


<Text style={styles.number}>

{analytics?.completed_today ?? 0}

</Text>


<Text>

Completed

</Text>


</View>


</View>







<View style={styles.aiCard}>


<Text style={styles.aiTitle}>

🤖 AI Habit Coach

</Text>


<Text>

{insight ||
"Create your first habit and start your journey."}

</Text>


</View>








<View style={styles.habitCard}>


<View style={styles.headerRow}>


<Text style={styles.title}>

Today's Habits

</Text>




<TouchableOpacity

onPress={()=>navigation.navigate("AddHabit")}

>


<Text style={styles.addText}>

+ Add

</Text>


</TouchableOpacity>


</View>






{

habits.length === 0 ?


<Text>

No habits created yet

</Text>


:


habits.map((habit)=>{


return(

<View

key={habit.id}

style={styles.habitItem}

>


<Text style={styles.habitTitle}>

📚 {habit.title}

</Text>


<Text>

{habit.frequency}

</Text>


<Text>

Target: {habit.target}

</Text>


</View>


);


})


}



</View>









<TouchableOpacity

style={styles.logout}

onPress={logout}

>


<Text style={styles.logoutText}>

Logout

</Text>


</TouchableOpacity>





</ScrollView>


);


}





const styles = StyleSheet.create({



container:{

flex:1,

backgroundColor:"#F8FAFC",

padding:20

},



greeting:{

fontSize:26,

fontWeight:"bold",

marginTop:40

},




progressCard:{

backgroundColor:"#4F46E5",

padding:25,

borderRadius:25,

marginTop:25

},



cardTitle:{

color:"white",

fontSize:18

},



percent:{

color:"white",

fontSize:45,

fontWeight:"bold"

},



whiteText:{

color:"white"

},




row:{

flexDirection:"row",

gap:15,

marginTop:20

},




smallCard:{

backgroundColor:"white",

padding:20,

borderRadius:20,

flex:1

},



number:{

fontSize:30,

fontWeight:"bold"

},





aiCard:{

backgroundColor:"#DCFCE7",

padding:20,

borderRadius:20,

marginTop:20

},



aiTitle:{

fontSize:18,

fontWeight:"bold",

marginBottom:8

},




habitCard:{

backgroundColor:"white",

padding:20,

borderRadius:20,

marginTop:20

},



headerRow:{

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center"

},



title:{

fontSize:20,

fontWeight:"bold"

},



addText:{

color:"#4F46E5",

fontWeight:"bold"

},




habitItem:{

backgroundColor:"#F8FAFC",

padding:15,

borderRadius:15,

marginTop:15

},



habitTitle:{

fontSize:18,

fontWeight:"bold"

},




logout:{

marginTop:30,

backgroundColor:"#EF4444",

padding:15,

borderRadius:15,

marginBottom:30

},



logoutText:{

color:"white",

textAlign:"center",

fontWeight:"bold"

}


});