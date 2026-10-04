import {
    useEffect
} from "react";


import {
    Platform
} from "react-native";


import Constants, {
    ExecutionEnvironment
} from "expo-constants";





export default function useNotifications(){


    useEffect(()=>{


        /*
        |--------------------------------------------------------------------------
        | Skip Web
        |--------------------------------------------------------------------------
        */


        if(
            Platform.OS === "web"
        ){

            return;

        }



        /*
        |--------------------------------------------------------------------------
        | Skip Expo Go
        |--------------------------------------------------------------------------
        */


        const runningInExpoGo =
            Constants.executionEnvironment
            ===
            ExecutionEnvironment.StoreClient;


        if(runningInExpoGo){


            console.log(
                "Notification listeners skipped in Expo Go."
            );


            return;

        }



        /*
        |--------------------------------------------------------------------------
        | Lazy Load
        |--------------------------------------------------------------------------
        */


        const Notifications =
            require(
                "expo-notifications"
            );



        /*
        |--------------------------------------------------------------------------
        | Notification Received
        |--------------------------------------------------------------------------
        */


        const receivedSubscription =
            Notifications
                .addNotificationReceivedListener(

                    notification=>{


                        console.log(

                            "NOTIFICATION RECEIVED:",

                            notification
                                .request
                                .content

                        );

                    }

                );



        /*
        |--------------------------------------------------------------------------
        | User Pressed Notification
        |--------------------------------------------------------------------------
        */


        const responseSubscription =
            Notifications
                .addNotificationResponseReceivedListener(

                    response=>{


                        const data =
                            response
                                .notification
                                .request
                                .content
                                .data;


                        console.log(

                            "NOTIFICATION PRESSED:",

                            data

                        );

                    }

                );



        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */


        return()=>{


            receivedSubscription
                .remove();


            responseSubscription
                .remove();

        };


    },[]);

}