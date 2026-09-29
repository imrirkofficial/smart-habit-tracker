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


import {
saveToken
} from "../storage/token";





export default function LoginScreen({navigation}){


const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [loading,setLoading] = useState(false);





const login = async()=>{


try{


setLoading(true);



const response = await api.post("/login",{

email,
password

});



console.log(
"LOGIN RESPONSE:",
response.data
);



await saveToken(
response.data.token
);




Alert.alert(

"Welcome Back 👋",

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

style={styles.logoImage}

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

onPress={login}

disabled={loading}

>



{

loading ?


<ActivityIndicator

color="white"

/>


:


<Text style={styles.buttonText}>

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







const styles = StyleSheet.create({



container:{

flex:1,

justifyContent:"center",

padding:25,

backgroundColor:"#F8FAFC"

},




logoImage:{

width:180,

height:180,

alignSelf:"center",

resizeMode:"contain",

marginBottom:20

},




welcome:{

fontSize:30,

fontWeight:"bold",

textAlign:"center",

color:"#0F172A"

},




subtitle:{

textAlign:"center",

fontSize:15,

color:"#64748B",

marginTop:8,

marginBottom:35

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

fontSize:16,

fontWeight:"bold",

textAlign:"center"

},





register:{

textAlign:"center",

marginTop:25,

color:"#16A34A",

fontWeight:"600"

}



});