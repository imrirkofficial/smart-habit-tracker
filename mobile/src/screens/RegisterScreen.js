import React,{useState} from "react";


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


import i18n from "../localization/i18n";





export default function RegisterScreen({navigation}){


const [name,setName]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [loading,setLoading]=useState(false);





const register=async()=>{


if(!name || !email || !password){

Alert.alert(
i18n.t("create_account"),
"Please fill all fields"
);

return;

}



try{


setLoading(true);



await api.post("/register",{

name,

email,

password,

password_confirmation:password

});



Alert.alert(

"🎉",

"Account created successfully",

[

{
text:i18n.t("login"),

onPress:()=>navigation.navigate("Login")
}

]

);


}


catch(error){


Alert.alert(

"Error",

error.response?.data?.message ||
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

{i18n.t("create_account")}

</Text>




<Text style={styles.subtitle}>

{i18n.t("tagline")}

</Text>





<TextInput

placeholder="Name"

style={styles.input}

onChangeText={setName}

/>





<TextInput

placeholder={i18n.t("email")}

style={styles.input}

keyboardType="email-address"

autoCapitalize="none"

onChangeText={setEmail}

/>





<TextInput

placeholder={i18n.t("password")}

secureTextEntry

style={styles.input}

onChangeText={setPassword}

/>






<TouchableOpacity

style={styles.button}

onPress={register}

>


{

loading ?

<ActivityIndicator color="white"/>


:

<Text style={styles.buttonText}>

{i18n.t("create_account")}

</Text>


}



</TouchableOpacity>





<TouchableOpacity

onPress={()=>navigation.navigate("Login")}

>


<Text style={styles.loginText}>

{i18n.t("already_account")}

 Login

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
marginVertical:25,
color:"#64748B"
},


input:{
backgroundColor:"white",
borderWidth:1,
borderColor:"#E2E8F0",
padding:16,
borderRadius:16,
marginBottom:15
},


button:{
backgroundColor:"#16A34A",
padding:17,
borderRadius:16
},


buttonText:{
color:"white",
textAlign:"center",
fontWeight:"bold"
},


loginText:{
textAlign:"center",
marginTop:25,
color:"#16A34A"
}

});