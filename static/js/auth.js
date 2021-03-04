import { ajaxCall } from './ajaxReq.js'
export class Auth {
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
            if(hasAlreadyTriedAuth)
            {
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

    login(params) {
        return new Promise(function(resolve, reject) {
            ajaxCall("/api/auth/login", "POST", params)
            .then(data => {
                console.log(data);
                Auth._instancedClass.saveLogin(data);
                Auth._instancedClass.hasAlreadyTriedAuth = true;
                //window.location.href = "/"; //TODO: redirect specifico
                resolve();
            })
            .catch((jqXHR, test_status, str_error) => {
                Auth._instancedClass.hasAlreadyTriedAuth = true;
                reject(jqXHR.responseJSON.message);
            })
        })
    }

    signup(params) {
        return new Promise(function(resolve, reject) {
            ajaxCall("/api/auth/signup", "POST", params)
            .then(data => {
                console.log(data);
                //TODO: salvare utente
                window.location.href = "/";
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
        this.setAuthTimer(response.expiresIn);
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
        this.setAuthTimer(expiresDuration);
    }

    tokenInfo = {
        token: null,
        expiresIn: null
    };

    autoAuthUser = new Promise((resolve, reject) => {
        this.hasAlreadyTriedAuth = true;
        this.tokenInfo = { token: localStorage.getItem("token"), expiresIn: new Date(localStorage.getItem("expiresIn")) };
        if(this.tokenInfo.token && this.tokenInfo.expiresIn)
        {
            const now = new Date();
            const expiresIn = this.tokenInfo.expiresIn.getTime() - now.getTime();
            if(expiresIn > 0 )
            {
                //TODO: controllo sul server
                ajaxCall("/api/auth/checkToken", "POST", null)
                    .then((data) => {
                        this.saveLogin(data);
                    })
                    .catch(() => {
                        this.clearAuthData();
                        this.user = {};
                    })
                this.setAuthTimer(expiresIn);
                this.user = JSON.parse(localStorage.getItem("user"));
                resolve(true);
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
            email: null,
            nome: null,
            cognome: null,
            isManager: null
        } 
        location.reload();
    }

    clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("user");
    }
}