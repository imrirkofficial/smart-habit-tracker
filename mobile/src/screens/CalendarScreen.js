import React from "react";


import {
View,
Text,
StyleSheet
} from "react-native";




export default function CalendarScreen(){


let days=[];


for(let i=1;i<=30;i++){

days.push(i);

}




return(

<View style={styles.container}>


<Text style={styles.title}>

📅 Habit Calendar

</Text>



<View style={styles.grid}>


{

days.map(day=>(


<View

key={day}

style={styles.box}

>


<Text>

{day}

</Text>


</View>


))


}



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


grid:{
flexDirection:"row",
flexWrap:"wrap",
marginTop:30
},


box:{
width:40,
height:40,
backgroundColor:"#DCFCE7",
margin:5,
justifyContent:"center",
alignItems:"center",
borderRadius:8
}


});