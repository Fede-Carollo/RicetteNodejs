"use strict";

const ANIMATION_TIME = 250; //ms
import { Auth } from "./auth.js"
const auth = Auth.instanceClass();
jQuery(() => {
    
    $("form [id$='Error'").hide()
    $("#login").on("click", login);
})

function login(){
    if(!CheckLoginValidity())
        return;
    const loginParams = {
        email: $("#email").val(),
        password: $("#password").val()
    }
    auth.login(loginParams)
        .catch(errMsg => {
            console.log(errMsg);
        })
        
    
}

function CheckLoginValidity() {
    const RegPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;
    const RegEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let isValid = true;
    if(!$("#email").val().toString().match(RegEmail))
    {
        $("#emailError").text("Email inserita non valida")
        .show(ANIMATION_TIME);
    }
    else
        $("#emailError").hide(ANIMATION_TIME);
    if(!$("#password").val().toString().match(RegPassword))
    {
        if($("#password").val().length < 8)
            $("#passwordError").text("La password deve contenere almeno 8 caratteri")
            .show(ANIMATION_TIME);
        else
            $("#passwordError").text("La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale")
            .show(ANIMATION_TIME);
    }
    else
        $("#passwordError").hide(ANIMATION_TIME);
    return isValid;
}