import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

interface AuthResponseData {
    kind: string;
    idToken: string;
    username: string;
    refreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}

interface UserData {
    username?: string;
    email: string;    
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isUserAuthenticated = false;

    constructor(private http: HttpClient) {}

    get isUserAuthenticated(): boolean {
        return this._isUserAuthenticated;
    }

    register(user: UserData) {
        this._isUserAuthenticated = true;
        return this.http.post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
          { email: user.email, password: user.password }
        );
    }

    logIn(user: UserData) {
        this._isUserAuthenticated = true;
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            { email: user.email, password: user.password }
          );
    }

    logOut() {
        this._isUserAuthenticated = false;
    }
}