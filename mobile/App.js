import React,{useEffect,useState} from "react";


import {
View,
ActivityIndicator
} from "react-native";


import AppNavigator from "./src/navigation/AppNavigator";


import {
loadLanguage
} from "./src/localization/i18n";





export default function App(){



const [ready,setReady] = useState(false);




useEffect(()=>{


const start = async()=>{


await loadLanguage();


setReady(true);


};


start();



},[]);






if(!ready){


return(

<View

style={{

flex:1,

justifyContent:"center",

alignItems:"center"

}}

>


<ActivityIndicator

size="large"

/>


</View>


);


}





return(

<AppNavigator/>

);


}