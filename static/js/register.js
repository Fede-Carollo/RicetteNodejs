"use strict";

const ANIMATION_TIME = 250; //ms
import { Auth } from "./auth.js"
const auth = Auth.instanceClass();


jQuery(() => {
    $("form [id$='Error'").hide()
    $("#register").on("click", register);
    $("form input").trigger("input");
})

function register() {
    if(!CheckRegisterValidity())
        return;
    const signupParams = {
        email: $("#email").val(),
        password: $("#password").val(),
        nome: $("#nome").val(),
        cognome: $("#cognome").val()
    }
    auth.signup(signupParams)
        .catch(errMsg => {
            console.log(errMsg);
            $(".snackbar").addClass("active").text(errMsg);
            setTimeout(() => {
                $(".snackbar").removeClass("active").text("");
                
            }, 5000)
        })
}

function CheckRegisterValidity() {
    const RegPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;
    const RegEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let isValid = true;
    //email
    if(!$("#email").val().toString().match(RegEmail))
    {
        $("#emailError").text("Email inserita non valida")
        .show(ANIMATION_TIME);
        isValid = false;
    }
    else
        $("#emailError").hide(ANIMATION_TIME);
    //password
    if(!$("#password").val().toString().match(RegPassword))
    {
        if($("#password").val().length < 8)
            $("#passwordError").text("La password deve contenere almeno 8 caratteri")
            .show(ANIMATION_TIME);
        else
            $("#passwordError").text("La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale")
            .show(ANIMATION_TIME);
        isValid = false;
    }
    else
        $("#passwordError").hide(ANIMATION_TIME);
    //TODO: controlli sul resto
    //conferma password
    if($("#password").val() !== $("#confirmPassword").val())
    {
        $("#confirmPasswordError").text("Le password non coincidono")
            .show(ANIMATION_TIME);
        isValid = false;
    }
    else
        $("#confirmPasswordError").hide(ANIMATION_TIME);
    //nome
    if($("#nome").val().toString().length < 3)
    {
        $("#nameError").text("Inserisci un nome valido!")
            .show(ANIMATION_TIME);
        isValid = false;
    }
    else
        $("#nameError").hide(ANIMATION_TIME);
    if($("#cognome").val().toString().length < 3)
    {
        $("#surnameError").text("Inserisci un cognome valido!")
            .show(ANIMATION_TIME);
        isValid = false;
    }
    else
        $("#surnameError").hide(ANIMATION_TIME);
    return isValid;
}