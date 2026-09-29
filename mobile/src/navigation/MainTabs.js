import React from "react";


import {
createBottomTabNavigator
} from "@react-navigation/bottom-tabs";


import {
Ionicons
} from "@expo/vector-icons";


import HomeScreen from "../screens/HomeScreen";
import AchievementScreen from "../screens/AchievementScreen";
import ProfileScreen from "../screens/ProfileScreen";


import i18n from "../localization/i18n";



const Tab = createBottomTabNavigator();





export default function MainTabs(){


return(


<Tab.Navigator


screenOptions={({route})=>({


headerShown:false,


tabBarActiveTintColor:"#16A34A",


tabBarInactiveTintColor:"#64748B",


tabBarStyle:{

height:65,

paddingBottom:8,

paddingTop:8

},



tabBarIcon:({color,size})=>{


let iconName;



if(route.name==="Home"){

iconName="home";

}

else if(route.name==="Achievements"){

iconName="trophy";

}

else{

iconName="person";

}




return(

<Ionicons

name={iconName}

size={size}

color={color}

/>

);


}



})}


>



<Tab.Screen

name="Home"

component={HomeScreen}

options={{

title:i18n.t("dashboard")

}}

/>





<Tab.Screen

name="Achievements"

component={AchievementScreen}

options={{

title:i18n.t("achievements")

}}

/>





<Tab.Screen

name="Profile"

component={ProfileScreen}

options={{

title:i18n.t("profile")

}}

/>





</Tab.Navigator>



);


}