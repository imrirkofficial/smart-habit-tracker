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
| Web:
| Laravel runs on the same PC.
|
| Android/iOS physical device:
| localhost/127.0.0.1 will NOT point to your PC.
| Replace the LAN IP below with your computer's current IPv4 address.
|
*/

const API_URL =
    Platform.OS === "web"
        ? "http://127.0.0.1:8000/api"
        : "http://192.168.0.101:8000/api";



const api = axios.create({

    baseURL: API_URL,

    timeout: 15000,

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


        if(token){

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
            error
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


        if(error.response){

            console.log(
                "API RESPONSE ERROR:",
                error.response.status,
                error.response.data
            );

        }

        else if(error.request){

            console.log(
                "API NETWORK ERROR:",
                error.message
            );

        }

        else{

            console.log(
                "API ERROR:",
                error.message
            );

        }


        return Promise.reject(error);

    }

);


export default api;