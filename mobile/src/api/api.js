import axios from "axios";

import {
getToken
} from "../storage/token";


const api = axios.create({

    baseURL:"http://127.0.0.1:8000/api",

    headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
    }

});



api.interceptors.request.use(

async(config)=>{


const token = await getToken();


if(token){

config.headers.Authorization =
`Bearer ${token}`;

}


return config;


});


export default api;