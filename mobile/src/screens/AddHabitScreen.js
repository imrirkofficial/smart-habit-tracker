import React,{useState} from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert
} from "react-native";


import api from "../api/api";



export default function AddHabitScreen({navigation}){


const [title,setTitle]=useState("");
const [description,setDescription]=useState("");
const [frequency,setFrequency]=useState("daily");
const [target,setTarget]=useState("");



const createHabit=async()=>{


try{


const response = await api.post("/habits",{

title,
description,
frequency,
target

});


console.log(response.data);



Alert.alert(
"Success",
"Habit created successfully"
);



navigation.navigate("Home",{

refresh:true

});



}

catch(error){


console.log(
"HABIT CREATE ERROR:",
error.response?.data || error.message
);


Alert.alert(
"Error",
"Could not create habit"
);


}


};




return(

<View style={styles.container}>


<Text style={styles.title}>
Create New Habit
</Text>



<TextInput

placeholder="Habit Name"

style={styles.input}

value={title}

onChangeText={setTitle}

/>




<TextInput

placeholder="Description"

style={styles.input}

value={description}

onChangeText={setDescription}

/>




<TextInput

placeholder="Frequency (daily/weekly)"

style={styles.input}

value={frequency}

onChangeText={setFrequency}

/>




<TextInput

placeholder="Target (30 min)"

style={styles.input}

value={target}

onChangeText={setTarget}

/>





<TouchableOpacity

style={styles.button}

onPress={createHabit}

>


<Text style={styles.buttonText}>
Create Habit
</Text>


</TouchableOpacity>



</View>

);


}



const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:25,
backgroundColor:"#F8FAFC"
},


title:{
fontSize:28,
fontWeight:"bold",
textAlign:"center",
marginBottom:30
},


input:{
backgroundColor:"white",
borderWidth:1,
borderColor:"#ddd",
padding:15,
borderRadius:15,
marginBottom:15
},


button:{
backgroundColor:"#4F46E5",
padding:16,
borderRadius:15
},


buttonText:{
color:"white",
textAlign:"center",
fontWeight:"bold"
}


});