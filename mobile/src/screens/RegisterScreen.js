import React, {useState} from "react";

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



export default function RegisterScreen({navigation}){


const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [loading,setLoading] = useState(false);



const register = async()=>{


if(!name || !email || !password){

Alert.alert(
"Missing Information",
"Please fill all fields"
);

return;

}



try{


setLoading(true);



const response = await api.post("/register",{

name,
email,
password,
password_confirmation: password

});



console.log(response.data);



Alert.alert(
"Success",
"Account created successfully",
[
{
text:"Login",
onPress:()=>navigation.navigate("Login")
}
]
);



}

catch(error){


console.log(
"REGISTER ERROR:",
error.response?.data || error.message
);



Alert.alert(

"Registration Failed",

error.response?.data?.message 
||
"Something went wrong"

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
Create Account
</Text>



<TextInput

placeholder="Name"

style={styles.input}

value={name}

onChangeText={setName}

/>



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

onPress={register}

disabled={loading}

>


{

loading ?

<ActivityIndicator color="white"/>

:

<Text style={styles.text}>
Register
</Text>

}


</TouchableOpacity>




<TouchableOpacity

onPress={()=>navigation.navigate("Login")}

>


<Text style={styles.login}>
Already have account? Login
</Text>


</TouchableOpacity>



</View>


);

}



const styles = StyleSheet.create({


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
color:"#4F46E5",
marginBottom:20
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
backgroundColor:"#22C55E",
padding:16,
borderRadius:15,
marginTop:10
},


text:{
color:"white",
textAlign:"center",
fontWeight:"bold"
},


login:{
textAlign:"center",
marginTop:20,
color:"#4F46E5"
}


});