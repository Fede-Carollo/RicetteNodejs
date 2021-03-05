const auth = Auth.instanceClass();
jQuery(() => {
    auth.getAuthState().then((isLogged) => {
        if(isLogged)
        {
            $("#liLogin").hide();
        }
        else
        {
            $("#liProfile").hide();
        }
    })
})