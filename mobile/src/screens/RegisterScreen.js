import React, {useState} from "react";


import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
ActivityIndicator,
Image
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

password_confirmation:password


});



console.log(
"REGISTER RESPONSE:",
response.data
);




Alert.alert(

"Account Created 🎉",

"Please login to continue",

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




<Image

source={require("../../assets/logo.png")}

style={styles.logo}

/>





<Text style={styles.title}>

Create Account

</Text>



<Text style={styles.subtitle}>

Start building better habits today

</Text>







<TextInput

placeholder="Full Name"

placeholderTextColor="#94A3B8"

style={styles.input}

value={name}

onChangeText={setName}

/>







<TextInput

placeholder="Email"

placeholderTextColor="#94A3B8"

style={styles.input}

keyboardType="email-address"

autoCapitalize="none"

value={email}

onChangeText={setEmail}

/>







<TextInput

placeholder="Password"

placeholderTextColor="#94A3B8"

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


<Text style={styles.buttonText}>

Create Account

</Text>


}



</TouchableOpacity>








<TouchableOpacity

onPress={()=>navigation.navigate("Login")}

>


<Text style={styles.loginText}>

Already have an account? Login

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

width:150,

height:150,

alignSelf:"center",

resizeMode:"contain",

marginBottom:15

},






title:{

fontSize:30,

fontWeight:"bold",

textAlign:"center",

color:"#0F172A"

},





subtitle:{

textAlign:"center",

marginTop:8,

marginBottom:35,

color:"#64748B",

fontSize:15

},






input:{

backgroundColor:"white",

borderWidth:1,

borderColor:"#E2E8F0",

padding:16,

borderRadius:16,

marginBottom:15,

fontSize:16

},






button:{

backgroundColor:"#16A34A",

padding:17,

borderRadius:16,

marginTop:10

},





buttonText:{

color:"white",

textAlign:"center",

fontWeight:"bold",

fontSize:16

},





loginText:{

textAlign:"center",

marginTop:25,

color:"#16A34A",

fontWeight:"600"

}



});