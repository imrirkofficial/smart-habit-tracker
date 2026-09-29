import AsyncStorage from "@react-native-async-storage/async-storage";


const LANGUAGE_KEY = "app_language";



export const saveLanguage = async(language)=>{


    await AsyncStorage.setItem(

        LANGUAGE_KEY,

        language

    );


};




export const getLanguage = async()=>{


    const language = await AsyncStorage.getItem(

        LANGUAGE_KEY

    );


    return language || "en";


};