"use strict";

const ANIMATION_TIME = 250; //ms
const auth = Auth.instanceClass();
let from;

jQuery(() => {
    const params = new URLSearchParams(window.location.search);
    from = params.get('from');
    auth.getAuthState()
        .then(isLogged => {
        updateHeader(isLogged)
          if(isLogged)  
          {
                
                if(from)
                    window.location.href = from;
                else
                    window.location.href = "/";
          }
          else {
            $("form [id$='Error'").hide()
            $("#login").on("click", login);

            if(from)
                $("#linkRegister").prop("href", $("#linkRegister").prop("href") + "?from=" + from);
          }
        })
})

function login(){
    if(!CheckLoginValidity())
        return;
    const loginParams = {
        email: $("#email").val(),
        password: $("#password").val()
    }
    let redirect = undefined;
    if(from) {
        redirect = "/" + from;
    }
    auth.login(loginParams, redirect || "/")
        .catch(errMsg => {
            console.log(errMsg);
            $(".snackbar").addClass("active").text(errMsg);
            setTimeout(() => {
                $(".snackbar").removeClass("active").text("");
                
            }, 5000)
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
        isValid = false;
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
        isValid = false;
    }
    else
        $("#passwordError").hide(ANIMATION_TIME);
    return isValid;
}