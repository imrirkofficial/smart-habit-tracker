import React,{useEffect,useRef} from "react";

import {
View,
Text,
Image,
StyleSheet,
Animated
} from "react-native";



export default function SplashScreen({navigation}){


const scale = useRef(
new Animated.Value(0.5)
).current;


const opacity = useRef(
new Animated.Value(0)
).current;



useEffect(()=>{


Animated.parallel([

Animated.spring(scale,{
toValue:1,
useNativeDriver:true
}),


Animated.timing(opacity,{
toValue:1,
duration:1200,
useNativeDriver:true
})


]).start();



setTimeout(()=>{

navigation.replace("Login");

},3000);



},[]);





return(

<View style={styles.container}>


<Animated.View

style={{

opacity,

transform:[
{
scale
}
]

}}

>


<Image

source={
require("../../assets/logo.png")
}

style={styles.logo}

/>


</Animated.View>



</View>

);


}




const styles=StyleSheet.create({


container:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:"#F0FDF4"
},


logo:{
width:220,
height:220,
resizeMode:"contain"
},


title:{
fontSize:28,
fontWeight:"bold",
color:"#14532D",
marginTop:20
},


tagline:{
marginTop:10,
color:"#16A34A"
}


});