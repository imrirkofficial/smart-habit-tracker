import React from "react";


import {
View,
Text,
StyleSheet
} from "react-native";


import {
LineChart
} from "react-native-chart-kit";





export default function AnalyticsScreen(){



return(


<View style={styles.container}>


<Text style={styles.title}>

📊 Analytics

</Text>




<LineChart

data={{

labels:[

"Mon",
"Tue",
"Wed",
"Thu",
"Fri"

],


datasets:[

{

data:[

40,
60,
50,
80,
90

]

}

]

}}


width={330}

height={220}


chartConfig={{

backgroundColor:"#16A34A",

backgroundGradientFrom:"#16A34A",

backgroundGradientTo:"#86EFAC",

color:()=>"#fff"

}}


/>



</View>


);

}





const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F0FDF4",
padding:20
},

title:{
fontSize:28,
fontWeight:"bold",
marginTop:40
}


});