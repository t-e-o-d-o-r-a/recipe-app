import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  addToFavourites(recipeId: string): Observable<any> {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      return of(null);
    }

    return this.http
      .put<any>(
        `${environment.firebaseRDBUrl}/favourites/${userId}/${recipeId}.json?auth=${token}`,
        true
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  removeFromFavourites(recipeId: string): Observable<any> {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      return of(null);
    }

    return this.http
      .delete<any>(
        `${environment.firebaseRDBUrl}/favourites/${userId}/${recipeId}.json?auth=${token}`
      )
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  getFavourites(): Observable<string[]> {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      return of([]);
    }

    return this.http
      .get<{ [key: string]: boolean }>(
        `${environment.firebaseRDBUrl}/favourites/${userId}.json?auth=${token}`
      )
      .pipe(
        map((favouritesData) => Object.keys(favouritesData)),
        catchError((error) => {
          return of([]);
        })
      );
  }
}
