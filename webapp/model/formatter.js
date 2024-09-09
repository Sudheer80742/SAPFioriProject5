sap.ui.define([],()=>{
    "use strict";
    
    return{
        status:(sta)=>{
            if(sta>=18){
                return "Success"
            }
            return "Error"
        }
    }
})