import React, {useEffect} from "react";

import {
View,
Image,
Text,
StyleSheet
} from "react-native";


export default function SplashScreen({navigation}){


useEffect(()=>{


setTimeout(()=>{

navigation.replace("Login");

},2500);


},[]);



return(

<View style={styles.container}>


<Image

source={require("../../assets/logo.png")}

style={styles.logo}

/>



<Text style={styles.tagline}>

Track Today • Build a Better Tomorrow

</Text>


</View>

);


}



const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:"#FFFFFF"
},


logo:{
width:250,
height:250,
resizeMode:"contain"
},


tagline:{
marginTop:20,
fontSize:16,
color:"#166534"
}


});