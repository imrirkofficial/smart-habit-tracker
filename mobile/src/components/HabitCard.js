import React from "react";


import {
View,
Text,
TouchableOpacity,
StyleSheet
} from "react-native";



export default function HabitCard({
habit,
onComplete
}){


return(


<View style={styles.card}>


<View>


<Text style={styles.title}>

📚 {habit.title}

</Text>


<Text style={styles.description}>

{habit.description}

</Text>



<Text style={styles.target}>

⏱ {habit.target} minutes

</Text>


</View>





<View style={styles.reward}>


<Text style={styles.xp}>

+20 XP

</Text>


<TouchableOpacity

style={styles.button}

onPress={()=>onComplete(habit.id)}

>


<Text style={styles.buttonText}>

✓ Complete

</Text>


</TouchableOpacity>


</View>



</View>


);


}




const styles=StyleSheet.create({


card:{
backgroundColor:"white",
padding:18,
borderRadius:22,
marginTop:15,
shadowColor:"#000",
shadowOpacity:0.08,
shadowRadius:10,
elevation:3
},


title:{
fontSize:19,
fontWeight:"bold",
color:"#0F172A"
},


description:{
marginTop:5,
color:"#64748B"
},


target:{
marginTop:8,
color:"#16A34A"
},


reward:{
marginTop:15
},


xp:{
color:"#CA8A04",
fontWeight:"bold"
},


button:{
backgroundColor:"#16A34A",
padding:12,
borderRadius:12,
marginTop:10
},


buttonText:{
color:"white",
textAlign:"center",
fontWeight:"bold"
}


});