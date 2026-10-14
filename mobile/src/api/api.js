import axios from "axios";

import {
    Platform
} from "react-native";

import {
    getToken
} from "../storage/token";


/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
|
| Development:
|   Web      → localhost Laravel
|   Android  → PC LAN IP Laravel
|
| Production:
|   Render Laravel API
|
*/


const API_URL =
    __DEV__
        ? (
            Platform.OS === "web"
                ? "http://127.0.0.1:8000/api"
                : "http://192.168.0.101:8000/api"
          )
        : "https://smart-habit-tracker-lenq.onrender.com/api";



const api = axios.create({

    baseURL: API_URL,

    timeout: 20000,

    headers: {

        Accept: "application/json",

        "Content-Type": "application/json"

    }

});



/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/


api.interceptors.request.use(

    async config => {


        const token =
            await getToken();


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            `${config.baseURL}${config.url}`
        );


        return config;

    },


    error => {


        console.log(
            "API REQUEST ERROR:",
            error.message
        );


        return Promise.reject(error);

    }

);



/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/


api.interceptors.response.use(

    response => {


        console.log(
            "API RESPONSE:",
            response.status,
            response.config.url
        );


        return response;

    },


    error => {


        if (error.response) {


            console.log(
                "API RESPONSE ERROR:",
                error.response.status,
                error.response.data
            );


        } else if (error.request) {


            console.log(
                "API NETWORK ERROR:",
                error.message
            );


        } else {


            console.log(
                "API ERROR:",
                error.message
            );

        }


        return Promise.reject(error);

    }

);



export default api;