class Auth {
    static _instancedClass = null;

    //classe singleton perché user è salvato nella classe
    static instanceClass() {
        if(!Auth._instancedClass)
            this._instancedClass = new Auth();
        return this._instancedClass;
    }

    hasAlreadyTriedAuth = false;

    getAuthState = () => {
        return new Promise((resolve, reject) => {
            if(this.hasAlreadyTriedAuth)
            {
                this.user = JSON.parse(localStorage.getItem("user"));
                resolve(this.user.isLogged);    
            }
            else
            {
                this.autoAuthUser()
                    .then((isAuth) => {
                        resolve(isAuth);
                    })
            }
        })
        
    }

    login(params, redirectRoute) {
        return new Promise(function(resolve, reject) {
            ajaxCall("/api/auth/login", "POST", params)
            .then(data => {
                console.log(data);
                Auth._instancedClass.saveLogin(data);
                Auth._instancedClass.hasAlreadyTriedAuth = true;
                window.location.href = redirectRoute;
                resolve();
            })
            .catch((jqXHR, test_status, str_error) => {
                Auth._instancedClass.hasAlreadyTriedAuth = true;
                reject(jqXHR.responseJSON.message);
            })
        })
    }

    signup(params, photo, redirectRoute = "/") {
        return new Promise(function(resolve, reject) {
            ajaxCall("/api/auth/signup", "POST", params)
            .then(data => {
                console.log(data);
                Auth._instancedClass.saveLogin(data);
                Auth._instancedClass.hasAlreadyTriedAuth = true;
                savePhoto("/api/auth/saveProfilePhoto", "POST", photo)
                .then((message) => {
                    console.log(message);
                })
                .catch((jqXHR, test_status, str_error) => {
                    console.log(jqXHR, test_status, str_error);
                })
                window.location.href = redirectRoute;
                resolve();
            })
            .catch((jqXHR, test_status, str_error) => {
                console.error(jqXHR.statusText);
                reject(jqXHR.responseJSON.message);
            })
        })
    }

    user = {
        isLogged: false,
        id: null,
        nome: null,
        cognome: null,
    };

    saveLogin(response) {
        this.user = {
            isLogged: true,
            id: response.tokenId,
            ...response.user
        };
        console.log(this.user);
        const expirationDate = new Date(Date.now() + response.expiresIn * 1000)
        localStorage.setItem("token", "Bearer " + response.token);
        localStorage.setItem("expiresIn", expirationDate.toISOString());
        localStorage.setItem("user", JSON.stringify(this.user));
        this.setAuthTimer(response.expiresIn * 1000);
        this.tokenInfo = { 
            token: response.token,
            expiresIn: expirationDate
        }
    };

    refreshToken = (expiresDuration, token) => {
        const expirationDate = new Date(Date.now() + expiresDuration * 1000);
        localStorage.setItem("token", "Bearer " + token);
        localStorage.setItem("expiresIn", expirationDate.toISOString());
        this.tokenInfo = {
            token: token, expiresIn: expirationDate
        }
        clearTimeout(this.tokenTimer);
        this.setAuthTimer(expiresDuration * 1000);
    }

    tokenInfo = {
        token: null,
        expiresIn: null
    };

    autoAuthUser = () => {
        return new Promise((resolve, reject) => {
            this.hasAlreadyTriedAuth = true;
            this.tokenInfo = { token: localStorage.getItem("token"), expiresIn: new Date(localStorage.getItem("expiresIn")) };
            if(this.tokenInfo.token && this.tokenInfo.expiresIn)
            {
                const now = new Date();
                const expiresIn = this.tokenInfo.expiresIn.getTime() - now.getTime();
                if(expiresIn > 0 )
                {
                    ajaxCall("/api/auth/checkToken", "POST", null)
                        .then((data) => {
                            this.saveLogin(data);
                            this.setAuthTimer(expiresIn);
                            resolve(true);
                        })
                        .catch(() => {
                            this.clearAuthData();
                            this.user = {};
                            resolve(false);
                        })
                    
                }
                else
                {
                    this.clearAuthData();
                    resolve(false);
                }
            }
            else
            {
                this.clearAuthData();
                resolve(false);
            }
        });
    } 

    setAuthTimer (duration) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration);
    }

    tokenTimer = null;

    logout() {
        console.log("chiamo logout");
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.tokenInfo = { token: null, expiresIn: null};
        this.user = {
            isLogged: false,
            id: null,
            nome: null,
            cognome: null
        } 
        location.reload();
    }

    clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("user");
    }
}