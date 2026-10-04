import React, {
    useEffect,
    useState
} from "react";


import {
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native";


import AppNavigator
from "./src/navigation/AppNavigator";


import {
    loadLanguage
} from "./src/localization/i18n";


import {
    setupDefaultNotifications
} from "./src/services/notificationService";


import useNotifications
from "./src/hooks/useNotifications";





export default function App(){


    const [ready,setReady] =
        useState(false);



    useNotifications();



    useEffect(()=>{


        const initializeApp =
            async()=>{


                try{


                    /*
                    Load saved language
                    */


                    await loadLanguage();



                    /*
                    Expo Go/Web automatically
                    skipped by service.
                    */


                    await setupDefaultNotifications();


                }

                catch(error){


                    console.log(

                        "APP INITIALIZATION ERROR:",

                        error

                    );


                }

                finally{


                    setReady(true);


                }


            };


        initializeApp();


    },[]);





    if(!ready){


        return(


            <View
                style={styles.loading}
            >


                <ActivityIndicator

                    size="large"

                    color="#16A34A"

                />


            </View>


        );

    }





    return(

        <AppNavigator/>

    );

}





const styles =
StyleSheet.create({


    loading:{

        flex:1,

        justifyContent:"center",

        alignItems:"center",

        backgroundColor:"#F0FDF4"

    }


});