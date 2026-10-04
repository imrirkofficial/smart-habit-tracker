import {
    Platform
} from "react-native";


import Constants, {
    ExecutionEnvironment
} from "expo-constants";


import AsyncStorage
from "@react-native-async-storage/async-storage";





const MORNING_KEY =
    "smart_habit_morning_notification";


const STREAK_KEY =
    "smart_habit_streak_notification";


let notificationHandlerConfigured = false;





/*
|--------------------------------------------------------------------------
| Environment Check
|--------------------------------------------------------------------------
|
| Expo Go Android SDK 53+
| does not support remote push functionality.
|
| Therefore we completely avoid loading
| expo-notifications inside Expo Go.
|
*/


export const isExpoGo = ()=>{

    return (
        Constants.executionEnvironment
        ===
        ExecutionEnvironment.StoreClient
    );

};





export const canUseNativeNotifications = ()=>{


    if(Platform.OS === "web"){

        return false;

    }


    if(isExpoGo()){

        return false;

    }


    return true;

};





/*
|--------------------------------------------------------------------------
| Lazy Load expo-notifications
|--------------------------------------------------------------------------
*/


const getNotifications = ()=>{


    if(
        !canUseNativeNotifications()
    ){

        return null;

    }


    /*
    Important:
    Do NOT use:
    import * as Notifications from "expo-notifications"

    at the top of this file.

    Expo Go would load it immediately.
    */


    return require(
        "expo-notifications"
    );

};





/*
|--------------------------------------------------------------------------
| Notification Handler
|--------------------------------------------------------------------------
*/


const configureNotificationHandler =
()=>{


    const Notifications =
        getNotifications();


    if(
        !Notifications
        ||
        notificationHandlerConfigured
    ){

        return;

    }


    Notifications.setNotificationHandler({

        handleNotification:
            async()=>({

                shouldPlaySound:true,

                shouldSetBadge:false,

                shouldShowBanner:true,

                shouldShowList:true

            })

    });


    notificationHandlerConfigured =
        true;

};





/*
|--------------------------------------------------------------------------
| Android Channel
|--------------------------------------------------------------------------
*/


const setupAndroidChannel =
async()=>{


    if(
        Platform.OS !== "android"
    ){

        return;

    }


    const Notifications =
        getNotifications();


    if(!Notifications){

        return;

    }


    await Notifications
        .setNotificationChannelAsync(

            "habit-reminders",

            {

                name:
                    "Habit Reminders",

                importance:
                    Notifications
                        .AndroidImportance
                        .HIGH,

                sound:
                    "default",

                vibrationPattern:[
                    0,
                    250,
                    250,
                    250
                ]

            }

        );

};





/*
|--------------------------------------------------------------------------
| Request Permission
|--------------------------------------------------------------------------
*/


export const requestNotificationPermission =
async()=>{


    if(
        !canUseNativeNotifications()
    ){

        console.log(
            "Notifications skipped: Expo Go/Web environment."
        );


        return false;

    }


    const Notifications =
        getNotifications();


    if(!Notifications){

        return false;

    }


    configureNotificationHandler();


    await setupAndroidChannel();


    const current =
        await Notifications
            .getPermissionsAsync();


    if(
        current.status === "granted"
    ){

        return true;

    }


    const result =
        await Notifications
            .requestPermissionsAsync();


    return (
        result.status === "granted"
    );

};





/*
|--------------------------------------------------------------------------
| Cancel Stored Notification
|--------------------------------------------------------------------------
*/


const cancelStoredNotification =
async(key)=>{


    const Notifications =
        getNotifications();


    if(!Notifications){

        return;

    }


    try{


        const notificationId =
            await AsyncStorage
                .getItem(key);


        if(notificationId){


            await Notifications
                .cancelScheduledNotificationAsync(
                    notificationId
                );


            await AsyncStorage
                .removeItem(key);

        }


    }

    catch(error){


        console.log(
            "CANCEL NOTIFICATION ERROR:",
            error
        );

    }

};





/*
|--------------------------------------------------------------------------
| Morning Reminder
|--------------------------------------------------------------------------
*/


export const scheduleMorningReminder =
async(
    hour = 8,
    minute = 0
)=>{


    const Notifications =
        getNotifications();


    if(!Notifications){

        return null;

    }


    await cancelStoredNotification(
        MORNING_KEY
    );


    const id =
        await Notifications
            .scheduleNotificationAsync({

                content:{

                    title:
                        "🌱 Smart Habit Tracker",

                    body:
                        "Your habits are waiting. Complete today's goals and keep your streak alive 🔥",

                    sound:
                        "default",

                    data:{

                        type:
                            "morning_reminder"

                    }

                },


                trigger:{

                    type:
                        "daily",

                    hour:
                        hour,

                    minute:
                        minute,

                    channelId:
                        "habit-reminders"

                }

            });


    await AsyncStorage.setItem(
        MORNING_KEY,
        id
    );


    return id;

};





/*
|--------------------------------------------------------------------------
| Streak Reminder
|--------------------------------------------------------------------------
*/


export const scheduleStreakReminder =
async(
    hour = 21,
    minute = 0
)=>{


    const Notifications =
        getNotifications();


    if(!Notifications){

        return null;

    }


    await cancelStoredNotification(
        STREAK_KEY
    );


    const id =
        await Notifications
            .scheduleNotificationAsync({

                content:{

                    title:
                        "🔥 Protect Your Streak",

                    body:
                        "Complete your remaining habits before the day ends.",

                    sound:
                        "default",

                    data:{

                        type:
                            "streak_reminder"

                    }

                },


                trigger:{

                    type:
                        "daily",

                    hour:
                        hour,

                    minute:
                        minute,

                    channelId:
                        "habit-reminders"

                }

            });


    await AsyncStorage.setItem(
        STREAK_KEY,
        id
    );


    return id;

};





/*
|--------------------------------------------------------------------------
| Habit Specific Reminder
|--------------------------------------------------------------------------
*/


export const scheduleHabitReminder =
async({

    habitId,

    title,

    hour,

    minute

})=>{


    const Notifications =
        getNotifications();


    if(!Notifications){

        return null;

    }


    return await Notifications
        .scheduleNotificationAsync({

            content:{

                title:
                    `🎯 ${title}`,

                body:
                    "Time to complete your habit and earn XP.",

                sound:
                    "default",

                data:{

                    type:
                        "habit_reminder",

                    habitId:
                        habitId

                }

            },


            trigger:{

                type:
                    "daily",

                hour:
                    hour,

                minute:
                    minute,

                channelId:
                    "habit-reminders"

            }

        });

};





/*
|--------------------------------------------------------------------------
| Immediate Test Notification
|--------------------------------------------------------------------------
*/


export const sendTestNotification =
async()=>{


    const Notifications =
        getNotifications();


    if(!Notifications){


        console.log(
            "Notification test skipped in Expo Go/Web."
        );


        return null;

    }


    return await Notifications
        .scheduleNotificationAsync({

            content:{

                title:
                    "✅ Smart Habit Tracker",

                body:
                    "Your notification system is working.",

                sound:
                    "default"

            },


            trigger:null

        });

};





/*
|--------------------------------------------------------------------------
| Default Notifications
|--------------------------------------------------------------------------
*/


export const setupDefaultNotifications =
async()=>{


    /*
    Expo Go / Web:
    silently skip.
    */


    if(
        !canUseNativeNotifications()
    ){


        console.log(
            "Notification system skipped in Expo Go/Web."
        );


        return false;

    }


    const allowed =
        await requestNotificationPermission();


    if(!allowed){


        console.log(
            "Notification permission not granted."
        );


        return false;

    }


    await scheduleMorningReminder(
        8,
        0
    );


    await scheduleStreakReminder(
        21,
        0
    );


    console.log(
        "Smart Habit reminders scheduled."
    );


    return true;

};





/*
|--------------------------------------------------------------------------
| Disable Notifications
|--------------------------------------------------------------------------
*/


export const disableDefaultNotifications =
async()=>{


    if(
        !canUseNativeNotifications()
    ){

        return;

    }


    await cancelStoredNotification(
        MORNING_KEY
    );


    await cancelStoredNotification(
        STREAK_KEY
    );

};





/*
|--------------------------------------------------------------------------
| Scheduled Notifications
|--------------------------------------------------------------------------
*/


export const getScheduledNotifications =
async()=>{


    const Notifications =
        getNotifications();


    if(!Notifications){

        return [];

    }


    return await Notifications
        .getAllScheduledNotificationsAsync();

};