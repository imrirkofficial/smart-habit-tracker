import React,{useEffect,useState} from "react";


import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Alert
} from "react-native";


import api from "../api/api";

import {
removeToken
} from "../storage/token";


import HabitCard from "../components/HabitCard";




export default function HomeScreen({navigation}){


const [analytics,setAnalytics]=useState({});

const [habits,setHabits]=useState([]);

const [insight,setInsight]=useState("");





useEffect(()=>{


const unsubscribe =
navigation.addListener(
"focus",
loadData
);


return unsubscribe;


},[]);






const loadData=async()=>{


try{


let a =
await api.get("/analytics");


setAnalytics(a.data);




let h =
await api.get("/habits");


setHabits(h.data);




let i =
await api.get("/ai-insights");


setInsight(i.data.insight);



}

catch(e){

console.log(e);

}


};







const completeHabit=async(id)=>{


try{


let res =
await api.post(
`/habits/${id}/complete`
);



Alert.alert(

"🎉 Great Job",

`+${res.data.reward.xp_added} XP Added`

);



loadData();


}

catch(e){

Alert.alert(
"Error",
"Habit already completed"
);

}


};






const logout=async()=>{


await removeToken();

navigation.replace("Login");


};







return(


<ScrollView style={styles.container}>


<Text style={styles.header}>

Good Evening, Robin 👋

</Text>





<View style={styles.levelCard}>


<Text style={styles.level}>

Level {analytics.level ?? 1}

</Text>


<Text style={styles.xp}>

XP {analytics.xp ?? 0}/100

</Text>


<Text style={styles.streak}>

🔥 {analytics.current_streak ?? 0} Day Streak

</Text>


</View>






<View style={styles.progress}>


<Text style={styles.progressTitle}>

Today's Progress

</Text>


<Text style={styles.percent}>

{analytics.completion_rate ?? 0}%

</Text>


</View>






<Text style={styles.section}>

Today's Quests

</Text>




{

habits.map(item=>(

<HabitCard

key={item.id}

habit={item}

onComplete={completeHabit}

/>

))


}






<View style={styles.ai}>


<Text style={styles.aiTitle}>

🤖 AI Habit Coach

</Text>


<Text>

{insight}

</Text>


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






const styles=StyleSheet.create({


container:{
flex:1,
backgroundColor:"#F0FDF4",
padding:20
},


header:{
fontSize:26,
fontWeight:"bold",
marginTop:40
},


levelCard:{
backgroundColor:"#16A34A",
padding:25,
borderRadius:25,
marginTop:20
},


level:{
color:"white",
fontSize:24,
fontWeight:"bold"
},


xp:{
color:"white",
marginTop:5
},


streak:{
color:"#FEF08A",
marginTop:10
},


progress:{
backgroundColor:"white",
padding:25,
borderRadius:25,
marginTop:20
},


progressTitle:{
fontSize:18
},


percent:{
fontSize:45,
fontWeight:"bold",
color:"#16A34A"
},


section:{
fontSize:22,
fontWeight:"bold",
marginTop:25
},


ai:{
backgroundColor:"#DCFCE7",
padding:20,
borderRadius:20,
marginTop:25
},


aiTitle:{
fontSize:18,
fontWeight:"bold"
},


logout:{
backgroundColor:"#EF4444",
padding:15,
borderRadius:15,
marginTop:30,
marginBottom:40
},


logoutText:{
color:"white",
textAlign:"center",
fontWeight:"bold"
}


});