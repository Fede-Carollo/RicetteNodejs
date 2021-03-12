"use strict";
const auth = Auth.instanceClass();
const RegEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
jQuery(() => {
    auth.getAuthState()
        .then(isLogged => {
            updateHeader(isLogged);

            if(isLogged)
            {
                window.location.href = "/";
            }
            else
            {
                $("#btnSendEmail").on("click", () => {
                    if($("#email").val().match(RegEmail))
                    {
                        ajaxCall("/api/auth/resetPassword", "POST", {email: $("#email").val()})
                            .then((response) => {
                                
                            })
                    }
                })
            }
        })
})