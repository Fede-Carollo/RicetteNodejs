function logout() {
    auth.logout()
}

function updateHeader(isLogged) {
    if(isLogged)
    {
        $("#liLogin").hide();
        $("#liProfile a").prop("href", $("#liProfile a").prop("href") + "?id=" + auth.user.id)
    }
    else
    {
        $("#liProfile").hide();
        $("#liLogout").hide();
    }
}