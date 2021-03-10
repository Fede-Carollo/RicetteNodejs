"use strict";

const ANIMATION_TIME = 250; //ms
const auth = Auth.instanceClass();

let from;

jQuery(() => {
    const params = new URLSearchParams(window.location.search);
    from = params.get('from');
    auth.getAuthState()
    .then((isLogged) => {
        if(isLogged) {
                if(from)
                    window.location.href = from;
                else
                    window.location.href = "/";
        }
        else
        {
            $("form [id$='Error'").hide()
            $("#register").on("click", register);
            $("form input").trigger("input");
            $("#image-filepicker").on("change", OnImageLoad)
            if(from)
                $("#linkLogin").prop("href", $("#linkLogin").prop("href") + "?from=" + from);
        }
    })
})

function register() {
    if(!CheckRegisterValidity())
        return;
    const formData = createFormData();
    const signupParams = {
        email: $("#email").val(),
        password: $("#password").val(),
        nome: $("#nome").val(),
        cognome: $("#cognome").val(),
        citazione: $("#citazione").val(),
    }

    let redirect = undefined;
    if(from) {
        redirect = "/" + from;
    }
    auth.signup(signupParams, formData, redirect || "/")
        .catch(errMsg => {
            console.log(errMsg);
            $(".snackbar").addClass("active").text(errMsg);
            setTimeout(() => {
                $(".snackbar").removeClass("active").text("");
                
            }, 5000)
        })
}

function createFormData() {
    const formData = new FormData();
    const ext = $("#image-filepicker").prop("files")[0].name.substr($("#image-filepicker").prop("files")[0].name.lastIndexOf("."));
    formData.append("profilephoto", $("#image-filepicker").prop("files")[0], "profile-photo" + ext);
    formData.append("prova", "ahahahahah");
    return formData;
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

    if($("#image-filepicker").prop("files").length == 0)
    {
        isValid = false;
        $(".img-preview").addClass("focus");
        $(".img-preview").shake(100, 40, 3);
    }
    else
        $(".img-preview").removeClass("focus");
    return isValid;
}

function OnImageLoad(event){
    if(event.target.files.length == 0)
        return;
    const file = event.target.files[0];
    let urlreader = new FileReader();
    $("#removeImg").css({display: "block"})
    urlreader.onload = (content) => {
        let src = content.target.result.toString();
        $("#profilePhoto").prop('src', src);
        $(".hover.show").first().removeClass("show");
        $(".img-preview").removeClass("focus");
        $(".hover span").text("Modifica foto profilo");
    }
    urlreader.readAsDataURL(file);
}

function removeImage(){
    $("#profilePhoto").prop('src',"");
    $("#image-filepicker").val(null);
    $("#removeImg").css("display","none");
    $(".hover").first().addClass("show");
    $(".hover span").text("Aggiungi foto profilo");
}

//#region  shake function
jQuery.fn.shake = function(interval,distance,times){
    interval = typeof interval == "undefined" ? 100 : interval;
    distance = typeof distance == "undefined" ? 10 : distance;
    times = typeof times == "undefined" ? 3 : times;
    var jTarget = $(this);
    jTarget.css('position','relative');
    for(var iter=0;iter<(times+1);iter++){
       jTarget.animate({ left: ((iter%2==0 ? distance : distance*-1))}, interval);
    }
    return jTarget.animate({ left: 0},interval);
 }
 //#endregion