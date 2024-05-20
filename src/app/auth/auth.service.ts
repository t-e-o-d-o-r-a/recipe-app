import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, tap } from "rxjs";
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
    username?: string;
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
    ).pipe(
        tap(response => {
          const userId = response.localId;
          this.http.put(
            `${environment.firebaseRDBUrl}/users/${userId}.json`,
            { id: userId, username: user.username, email: user.email }
          ).subscribe();
        })
      );
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
          const userId = userData.localId;

          this.http.get<{ username: string }>(`${environment.firebaseRDBUrl}/users/${userId}.json`)
          .subscribe(userFromDb => {
            this.user = new User(
              userId,
              userData.email,
              userData.idToken,
              expirationTime,
              userFromDb?.username
            );
            this.userLoginComplete.next();
          });
        })
      );
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