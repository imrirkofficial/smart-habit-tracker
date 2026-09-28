import React,{useState} from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
ActivityIndicator
} from "react-native";


import api from "../api/api";

import {
saveToken
} from "../storage/token";



export default function LoginScreen({navigation}){


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [loading,setLoading]=useState(false);



const login = async()=>{


try{


setLoading(true);



const response = await api.post("/login",{

email,
password

});



console.log("LOGIN RESPONSE:",response.data);



await saveToken(response.data.token);



Alert.alert(
"Success",
"Login successful"
);



navigation.replace("Home");



}

catch(error){


console.log(
"LOGIN ERROR:",
error.response?.data || error.message
);



Alert.alert(

"Login Failed",

error.response?.data?.message
||
error.message

);


}

finally{

setLoading(false);

}


};



return(

<View style={styles.container}>


<Text style={styles.logo}>
🔥 SmartHabit
</Text>


<Text style={styles.title}>
Welcome Back
</Text>



<TextInput

placeholder="Email"

style={styles.input}

keyboardType="email-address"

autoCapitalize="none"

value={email}

onChangeText={setEmail}

/>



<TextInput

placeholder="Password"

secureTextEntry

style={styles.input}

value={password}

onChangeText={setPassword}

/>



<TouchableOpacity

style={styles.button}

onPress={login}

>

{

loading ?

<ActivityIndicator color="white"/>

:

<Text style={styles.text}>
Login
</Text>

}


</TouchableOpacity>



<TouchableOpacity

onPress={()=>navigation.navigate("Register")}

>

<Text style={styles.register}>
Create Account
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


logo:{
fontSize:32,
fontWeight:"bold",
textAlign:"center",
color:"#4F46E5"
},


title:{
fontSize:26,
textAlign:"center",
marginVertical:30
},


input:{
backgroundColor:"white",
borderWidth:1,
borderColor:"#ddd",
padding:15,
borderRadius:12,
marginBottom:15
},


button:{
backgroundColor:"#4F46E5",
padding:16,
borderRadius:12
},


text:{
color:"white",
textAlign:"center",
fontWeight:"bold"
},


register:{
textAlign:"center",
marginTop:20
}


});