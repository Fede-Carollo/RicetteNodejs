import { ajaxCall } from './ajaxReq.js'
export class Auth {
    static _instancedClass = null;

    //classe singleton perché user è salvato nella classe
    static instanceClass() {
        if(!Auth._instancedClass)
            this._instancedClass = new Auth();
        return this._instancedClass;
    }

    login(params) {
        return new Promise(function(resolve, reject) {
            ajaxCall("/api/auth/login", "POST", params)
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
        email: null,
        nome: null,
        cognome: null,
    };

    loggedIn(response) {
        console.log("Logged in function", response);
        console.log(this.user);
        this.user = {
            isLogged: true,
            ...response.data.user
        };
        console.log(this.user);
        const expirationDate = new Date(Date.now() + response.data.tokenInfo.expiresIn * 1000)
        localStorage.setItem("token", "Bearer " + response.data.tokenInfo.token);
        localStorage.setItem("expiresIn", expirationDate.toISOString());
        localStorage.setItem("user", JSON.stringify(this.user));
    };

    tokenInfo = {
        token: null,
        expiresIn: null
    };

    autoAuthUser = new Promise((resolve, reject) => {
        this.tokenInfo = { token: localStorage.getItem("token"), expiresIn: new Date(localStorage.getItem("expiresIn")) };
        if(this.tokenInfo.token && this.tokenInfo.expiresIn)
        {
            const now = new Date();
            const expiresIn = this.tokenInfo.expiresIn.getTime() - now.getTime();
            if(expiresIn > 0 )
            {
                //TODO: controllo suìl server
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