import React,{useEffect,useState} from "react";


import {
View,
Text,
StyleSheet
} from "react-native";


import api from "../api/api";


import i18n from "../localization/i18n";





export default function AchievementScreen(){



const [achievements,setAchievements]=useState([]);





useEffect(()=>{


loadAchievements();


},[]);





const loadAchievements=async()=>{


try{


const response =
await api.get("/achievements");


setAchievements(
response.data
);


}

catch(error){


console.log(
"Achievement Error:",
error
);


}


};







return(


<View style={styles.container}>


<Text style={styles.title}>

🏆 {i18n.t("achievements")}

</Text>





{

achievements.length===0 ?



<Text style={styles.empty}>

{i18n.t("no_achievement")}

</Text>





:



achievements.map((item)=>(


<View

key={item.id}

style={

[
styles.card,

item.unlocked

?

styles.unlocked

:

styles.locked

]

}

>





<Text style={styles.badge}>


{

item.unlocked

?

"🏆"

:

"🔒"


}


</Text>






<Text style={styles.name}>

{item.title}

</Text>





<Text style={styles.description}>

{item.description}

</Text>





<Text style={styles.status}>


{

item.unlocked

?

"🏆 Unlocked"

:

"🔒 Locked"


}



</Text>







</View>


))


}



</View>


);


}









const styles=StyleSheet.create({



container:{

flex:1,

backgroundColor:"#F0FDF4",

padding:20

},





title:{

fontSize:28,

fontWeight:"bold",

marginTop:40,

marginBottom:25

},





card:{

backgroundColor:"white",

padding:20,

borderRadius:20,

marginBottom:15

},





unlocked:{

borderWidth:2,

borderColor:"#16A34A"

},





locked:{

opacity:0.6

},





badge:{

fontSize:40

},





name:{

fontSize:20,

fontWeight:"bold",

marginTop:10

},





description:{

color:"#64748B",

marginTop:8

},





status:{

marginTop:15,

fontWeight:"bold",

color:"#16A34A"

},





empty:{

color:"#64748B",

fontSize:16

}



});