import React from "react";


import {
NavigationContainer
} from "@react-navigation/native";


import {
createNativeStackNavigator
} from "@react-navigation/native-stack";



import SplashScreen from "../screens/SplashScreen";

import LoginScreen from "../screens/LoginScreen";

import RegisterScreen from "../screens/RegisterScreen";

import AddHabitScreen from "../screens/AddHabitScreen";


import MainTabs from "./MainTabs";




const Stack =
createNativeStackNavigator();





export default function AppNavigator(){



return(


<NavigationContainer>



<Stack.Navigator


initialRouteName="Splash"


screenOptions={{

headerShown:false

}}


>




<Stack.Screen

name="Splash"

component={SplashScreen}

/>





<Stack.Screen

name="Login"

component={LoginScreen}

/>





<Stack.Screen

name="Register"

component={RegisterScreen}

/>





<Stack.Screen

name="Main"

component={MainTabs}

/>





<Stack.Screen

name="AddHabit"

component={AddHabitScreen}

/>





</Stack.Navigator>



</NavigationContainer>


);


}