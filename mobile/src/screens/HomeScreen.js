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


import i18n from "../localization/i18n";





export default function HomeScreen({navigation}){


const [analytics,setAnalytics] = useState({});

const [habits,setHabits] = useState([]);

const [insight,setInsight] = useState("");







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





// Habits

const habitsResponse =
await api.get("/habits");


setHabits(
habitsResponse.data
);






// AI Insight

const insightResponse =
await api.get("/ai-insights");


setInsight(
insightResponse.data.insight
);



}

catch(error){


console.log(

"HOME ERROR:",

error.response?.data || error.message

);


}


};







const completeHabit = async(id)=>{


try{


const response = await api.post(

`/habits/${id}/complete`

);




Alert.alert(

"🎉",

`+${response.data.reward.xp_added} XP`

);




loadData();


}



catch(error){


Alert.alert(

"Error",

"Already completed today"

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





<Text style={styles.header}>

{i18n.t("welcome")} Robin 👋

</Text>






<View style={styles.levelCard}>


<Text style={styles.level}>

{i18n.t("level")} {analytics.level ?? 1}

</Text>



<Text style={styles.xp}>

{i18n.t("xp")} {analytics.xp ?? 0}/100

</Text>




<Text style={styles.streak}>

🔥 {analytics.current_streak ?? 0}

 {i18n.t("streak")}

</Text>


</View>








<View style={styles.progress}>


<Text style={styles.progressTitle}>

{i18n.t("today_progress")}

</Text>



<Text style={styles.percent}>

{analytics.completion_rate ?? 0}%

</Text>



</View>









<Text style={styles.section}>

{i18n.t("habits")}

</Text>







{

habits.length === 0 ?


<Text style={styles.empty}>

{i18n.t("add_habit")}

</Text>



:


habits.map((item)=>(


<HabitCard

key={item.id}

habit={item}

onComplete={completeHabit}

/>


))


}









<View style={styles.ai}>


<Text style={styles.aiTitle}>

🤖 {i18n.t("ai_coach")}

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

{i18n.t("logout")}

</Text>


</TouchableOpacity>






</ScrollView>


);


}








const styles = StyleSheet.create({



container:{

flex:1,

backgroundColor:"#F0FDF4",

padding:20

},




header:{

fontSize:26,

fontWeight:"bold",

marginTop:40,

color:"#0F172A"

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

marginTop:8

},





streak:{

color:"#FEF08A",

marginTop:10,

fontWeight:"bold"

},





progress:{

backgroundColor:"white",

padding:25,

borderRadius:25,

marginTop:20

},





progressTitle:{

fontSize:18,

color:"#334155"

},





percent:{

fontSize:45,

fontWeight:"bold",

color:"#16A34A",

marginTop:10

},





section:{

fontSize:22,

fontWeight:"bold",

marginTop:25,

color:"#0F172A"

},





empty:{

marginTop:15,

color:"#64748B"

},





ai:{

backgroundColor:"#DCFCE7",

padding:20,

borderRadius:20,

marginTop:25

},





aiTitle:{

fontSize:18,

fontWeight:"bold",

marginBottom:10

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