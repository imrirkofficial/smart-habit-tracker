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


import {
saveLanguage
} from "../storage/language";


import i18n from "../localization/i18n";





export default function LoginScreen({navigation}){


const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [loading,setLoading] = useState(false);






const changeLanguage = async(language)=>{


i18n.locale = language;


await saveLanguage(language);



};



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

i18n.t("welcome"),

i18n.t("login") + " successful"

);





navigation.replace("Main");



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





{/* Language Selector */}


<View style={styles.languageBox}>


<TouchableOpacity

onPress={()=>changeLanguage("bn")}

>


<Text style={styles.languageText}>

English

</Text>


</TouchableOpacity>




<Text style={styles.separator}>

|

</Text>





<TouchableOpacity

onPress={()=>changeLanguage("bn")}

>


<Text style={styles.languageText}>

বাংলা

</Text>


</TouchableOpacity>



</View>







<TextInput

placeholder={i18n.t("email")}

placeholderTextColor="#94A3B8"

style={styles.input}

keyboardType="email-address"

autoCapitalize="none"

value={email}

onChangeText={setEmail}

/>







<TextInput

placeholder={i18n.t("password")}

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

{i18n.t("login")}

</Text>


}




</TouchableOpacity>







<TouchableOpacity

onPress={()=>navigation.navigate("Register")}

>


<Text style={styles.register}>

{i18n.t("create_account")}

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





languageBox:{

flexDirection:"row",

justifyContent:"center",

alignItems:"center",

marginBottom:25

},





languageText:{

color:"#16A34A",

fontWeight:"bold",

fontSize:16,

marginHorizontal:10

},




separator:{

color:"#94A3B8",

fontSize:18

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