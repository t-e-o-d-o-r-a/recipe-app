import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Subject, switchMap, tap} from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}

export interface UserData {
    email: string;
    password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isUserAuthenticated = false;
  user: User;
  userLoginComplete = new Subject<void>();

  constructor(private http: HttpClient) {}

  get isUserAuthenticated(): boolean {
    if (this.user) {
      return !!this.user.token;
    } else {
      return false;
    }
  }

  register(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    )
  }

  logIn(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email: user.email, password: user.password, returnSecureToken: true }
      )
      .pipe(
        tap(userData => {
          const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );

          const user = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expirationTime,
          );

          this.user = user;
          this.userLoginComplete.next();

        })
      )
  }

  logOut() {
    this.user = null;
    this._isUserAuthenticated = false;
  }

  getToken() {
    return this.user?.token;
  }

  getUserId() {
    return this.user?.id;
  }
}
