import {I18n} from "i18n-js";


import en from "./en.json";

import bn from "./bn.json";


import {
getLanguage
} from "../storage/language";




const i18n = new I18n({

    en,

    bn

});



export const loadLanguage = async()=>{


    const language = await getLanguage();


    i18n.locale = language;


};




i18n.locale = "en";


export default i18n;