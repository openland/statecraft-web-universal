import * as auth0 from 'auth0-js';
import createHistory from 'history/createBrowserHistory';
import { History } from 'history';
import { canUseDOM } from './environment';
import * as Cookie from 'js-cookie';

export interface AuthResult {
    expiresIn: number;
    accessToken: string;
    idToken: string;
}

export function getClientToken() {
    return Cookie.get("statecraft-key");
}

export function getServerToken(context: any) {
    return context.headers.cookie.split(';').find((c: string) => c.trim().startsWith('statecraft-key='));
}

export class AuthenticationController {
    private auth: auth0.WebAuth
    private history?: History

    constructor(context?: any) {
        if (!canUseDOM) {
            throw "Can't use authentication from SSR!"
        }
        this.auth = new auth0.WebAuth({
            domain: 'statecraft.auth0.com',
            clientID: 'na0Pvis7KTzZWtzcIFT8MzIxtdpiLZc3',
            redirectUri: window.location.origin + '/auth/complete',
            audience: 'https://statecraft.auth0.com/userinfo',
            responseType: 'token id_token',
            scope: 'openid profile email'
        });
        this.history = createHistory({
            forceRefresh: true
        });
    }

    startAuth() {
        this.auth.authorize({});
    }

    async completeAuth() {
        let auth = await this.retreiveAuthentication();
        var uploaded = await fetch('https://statecraft-api.herokuapp.com/auth', {
            method: 'POST',
            headers: [
                ['authorization', 'Bearer ' + auth.idToken],
                ['access-token', auth.accessToken]
            ]
        });
        if (uploaded.ok) {
            Cookie.set("statecraft-key", auth.idToken, { expires: auth.expiresIn })
        }
        this.history!!.replace('/');
    }

    logOut() {
        Cookie.remove("statecraft-key")
        this.history!!.replace('/');
    }

    private async retreiveAuthentication() {
        return new Promise<AuthResult>((resolve, reject) => {
            this.auth.parseHash((err, authResult: { expiresIn: number, accessToken: string, idToken: string }) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve({
                        expiresIn: authResult.expiresIn,
                        accessToken: authResult.accessToken,
                        idToken: authResult.idToken
                    });
                }
            });
        });
    }
}