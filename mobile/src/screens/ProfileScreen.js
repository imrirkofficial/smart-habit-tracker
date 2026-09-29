import React,{useEffect,useState} from "react";


import {
View,
Text,
StyleSheet,
TouchableOpacity
} from "react-native";


import api from "../api/api";

import i18n from "../localization/i18n";


import {
saveLanguage
} from "../storage/language";





export default function ProfileScreen(){


const [user,setUser]=useState({});



const loadProfile=async()=>{


const res =
await api.get("/profile");


setUser(res.data);


};



useEffect(()=>{

loadProfile();

},[]);






const changeLanguage=async(lang)=>{


i18n.locale=lang;


await saveLanguage(lang);


loadProfile();


};







return(


<View style={styles.container}>


<Text style={styles.title}>

👤 {i18n.t("profile")}

</Text>





<View style={styles.card}>


<Text style={styles.name}>

{user.name}

</Text>


<Text>

📧 {user.email}

</Text>



<Text style={styles.stat}>

⭐ {i18n.t("level")} {user.level}

</Text>



<Text style={styles.stat}>

🔥 {user.current_streak} {i18n.t("streak")}

</Text>



<Text style={styles.stat}>

🪙 {i18n.t("coins")} {user.coins}

</Text>



</View>








<Text style={styles.language}>

🌐 {i18n.t("language")}

</Text>




<View style={styles.row}>


<TouchableOpacity

style={styles.langBtn}

onPress={()=>changeLanguage("en")}

>

<Text>

English

</Text>

</TouchableOpacity>





<TouchableOpacity

style={styles.langBtn}

onPress={()=>changeLanguage("bn")}

>

<Text>

বাংলা

</Text>

</TouchableOpacity>


</View>





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
marginTop:40
},


card:{
backgroundColor:"white",
padding:25,
borderRadius:25,
marginTop:25
},


name:{
fontSize:25,
fontWeight:"bold",
marginBottom:10
},


stat:{
fontSize:18,
marginTop:15,
color:"#16A34A"
},


language:{
fontSize:20,
fontWeight:"bold",
marginTop:30
},


row:{
flexDirection:"row",
gap:15,
marginTop:15
},


langBtn:{
backgroundColor:"white",
padding:15,
borderRadius:15
}


});