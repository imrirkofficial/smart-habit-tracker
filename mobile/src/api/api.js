import axios from "axios";

import {
    getToken
} from "../storage/token";


/*
|--------------------------------------------------------------------------
| Production API URL
|--------------------------------------------------------------------------
|
| Laravel Backend:
| Render + Supabase PostgreSQL
|
*/


const API_URL =
    "https://smart-habit-tracker-lenq.onrender.com/api";



const api = axios.create({

    baseURL: API_URL,

    timeout: 30000,

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


        } 
        else if (error.request) {


            console.log(
                "API NETWORK ERROR:",
                error.message
            );


        } 
        else {


            console.log(
                "API ERROR:",
                error.message
            );

        }


        return Promise.reject(error);

    }

);



export default api;