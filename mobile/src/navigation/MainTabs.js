import React from "react";


import {
createBottomTabNavigator
} from "@react-navigation/bottom-tabs";


import {
Ionicons
} from "@expo/vector-icons";



import HomeScreen from "../screens/HomeScreen";

import AnalyticsScreen from "../screens/AnalyticsScreen";

import CalendarScreen from "../screens/CalendarScreen";

import AchievementScreen from "../screens/AchievementScreen";

import AICoachScreen from "../screens/AICoachScreen";

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

height:70,

paddingBottom:8,

paddingTop:8,

backgroundColor:"#FFFFFF",

borderTopWidth:0

},





tabBarIcon:({color,size})=>{


let iconName;



switch(route.name){



case "Home":

iconName="home";

break;




case "Analytics":

iconName="bar-chart";

break;




case "Calendar":

iconName="calendar";

break;




case "Achievements":

iconName="trophy";

break;




case "Coach":

iconName="chatbubble-ellipses";

break;




case "Profile":

iconName="person";

break;




default:

iconName="home";


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

name="Analytics"

component={AnalyticsScreen}

options={{

title:i18n.t("analytics")

}}

/>







<Tab.Screen

name="Calendar"

component={CalendarScreen}

options={{

title:i18n.t("calendar")

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

name="Coach"

component={AICoachScreen}

options={{

title:i18n.t("ai_coach")

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