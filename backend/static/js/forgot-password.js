"use strict";
const auth = Auth.instanceClass();
const RegEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const RegPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;



jQuery(() => {
    auth.getAuthState()
        .then(isLogged => {
            updateHeader(isLogged);
            setupSendMail(isLogged);
        })
})

function setupSendMail(isLogged){
    $("[id^='Error']").hide()
    $("#sendEmail").on("click", () => {
        if($("#email").val().match(RegEmail))
        {
            $("#emailError").hide("ease");
            $("#email").prop("disabled", true);
            $("#sendEmail").prop("disabled", true);
            ajaxCall("/api/auth/resetPassword", "POST", {email: $("#email").val()})
                .then((response) => {
                    
                    setupCodeInsert(isLogged);
                })
                .catch((jqXHR, test_status, str_error) => {
                    $("#email").prop("disabled", false);
                    $("#sendEmail").prop("disabled", false);
                    showSnackBar(jqXHR.responseJSON.message || "Si è verificato un errore");
                })
        }
        else
        {
            $("#emailError").show("ease").text("Formato della password non valido");
        }
    })
}

function setupCodeInsert(isLogged) {
    $("#container-code").show("ease");
    $("#verificaCodice").on("click", () => {
        if($("#email").val().match(RegEmail) && $("#code").val().match(/[0-9]{5}/g) && $("#code").val().length == 5)
        {
            $("#codeError").hide("ease");
            $("#verificaCodice").prop("disabled", true);
            ajaxCall("/api/auth/checkCode", "POST", {code: $("#code").val(), email: $("#email").val()})
                .then((response) => {
                    setupNewPassword(isLogged);
                })
                .catch((jqXHR, test_status, str_error) => {
                    $("#verificaCodice").prop("disabled", false);
                    showSnackBar(jqXHR.responseJSON.message);
                })
        }
        else
        {
            $("#codeError").show("ease").text("Formato codice non valido")
        }
    })
}

function setupNewPassword(isLogged) {
    $("#container-new-password").show("ease");
    $("#setPassword").on("click", (event) => {
        if(!checkValidity())
            return;
        $("#setPassword").prop("disabled", true);
        ajaxCall("/api/auth/newPassword", "POST", {
            email: $("#email").val(), 
            password: $("#newPassword").val()
        })
            .then((response) => {
                if(isLogged)
                {
                    window.location.href = "/";
                }
                else
                {
                    window.location.href = "/login.html";
                }
            })
            .catch((jqXHR, test_status, str_error) => {
                $("#setPassword").prop("disabled", false);
                showSnackBar(jqXHR.responseJSON.message);
            })
    })
}

function checkValidity() {
    let isValid = true;
    if(!$("#newPassword").val().match(RegPassword))
    {
        $("#newPassError").text("La password inserita non è valida").show("ease")
        isValid = false;
    }
    else
    {
        $("#newPassError").hide("ease");
        if($("#newPassword").val() != $("#confirmNewPassword").val())
        {
            $("#confirmNewPassError").text("Le password non coincidono").show("ease");
            isValid = false;
        }
        else
        {
            $("#confirmNewPassError").hide("ease");
        }
    }
    return isValid;
}

function showSnackBar(errMsg =  "Qualcosa è andato storto") {
    $(".snackbar").addClass("active").text(errMsg);
            setTimeout(() => {
                $(".snackbar").removeClass("active").text("");
                
            }, 5000)
}