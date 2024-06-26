import { Injectable } from '@angular/core';
import {DifficultyLevel, Recipe} from "./recipe.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, map, switchMap, take, tap} from "rxjs";
import {AuthService} from "../auth/auth.service";

interface RecipeData {
  title: string;
  description: string;
  ingredients?: string[];
  instructions: string;
  difficulty: DifficultyLevel;
  creatorID: string;
  imageURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private _recipes = new BehaviorSubject<Recipe[]>([]);
  private _myRecipes = new BehaviorSubject<Recipe[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) { }

  addRecipe(title: string, description: string, ingredients: string[], instructions: string, difficulty: DifficultyLevel, imageURL: string) {
    let generatedId: string;
    let userId: string = this.authService.getUserId();

    return this.http.post<{name: string}>(`${environment.firebaseRDBUrl}/recipes.json?auth=${this.authService.getToken()}`, {
      title,
      description,
      ingredients,
      instructions,
      difficulty,
      creatorID: userId,
      imageURL
    }).pipe(switchMap((resData) => {

      generatedId = resData.name;
      return this.myRecipes; //vracamo novi observable

    }),
      take(1),
      tap((recipes) => {
      this._myRecipes.next(recipes.concat({
        id: generatedId,
        title,
        description,
        ingredients,
        instructions,
        creatorID: userId,
        difficulty,
        imageURL
      }));

    }));
  }

  get recipes() {
    return this._recipes.asObservable();
  }

  get myRecipes() {
    return this._myRecipes.asObservable();
  }

  getRecipes() {
    return this.http
      .get<{[key: string]: RecipeData}>(`${environment.firebaseRDBUrl}/recipes.json?auth=${this.authService.getToken()}`)
      .pipe(map((recipesData) => {
        const recipes: Recipe[] = [];

        for (const key in recipesData) {
          if(recipesData.hasOwnProperty(key) && recipesData[key].creatorID !== this.authService.getUserId()) {
            recipes.push({
              id: key,
              title: recipesData[key].title,
              description: recipesData[key].description,
              ingredients: recipesData[key].ingredients,
              instructions: recipesData[key].instructions,
              creatorID: recipesData[key].creatorID,
              difficulty: this.matchDifficulty(recipesData[key].difficulty),
              imageURL: recipesData[key].imageURL,
            });
          }
        }

        return recipes;
      }),
        tap((recipes) => {
          this._recipes.next(recipes);
        }));
  }

  getMyRecipes() {
    return this.http.get<{[key: string]: RecipeData}>(`${environment.firebaseRDBUrl}/recipes.json?auth=${this.authService.getToken()}&orderBy="creatorID"&equalTo="${this.authService.getUserId()}"`).pipe(
      map((recipesData) => {
        const myRecipes: Recipe[] = [];

        for (const key in recipesData) {
          if(recipesData.hasOwnProperty(key)) {
            myRecipes.push({
              id: key,
              title: recipesData[key].title,
              description: recipesData[key].description,
              ingredients: recipesData[key].ingredients,
              instructions: recipesData[key].instructions,
              creatorID: recipesData[key].creatorID,
              difficulty: this.matchDifficulty(recipesData[key].difficulty),
              imageURL: recipesData[key].imageURL
            });
          }
        }

        return myRecipes;
      }),
      tap((myRecipes) => {
        this._myRecipes.next(myRecipes);
      })
    );
  }

  getRecipe(id: string) {
    return this.http.get<RecipeData>(`${environment.firebaseRDBUrl}/recipes/${id}.json?auth=${this.authService.getToken()}`)
      .pipe(map((resData) => {
        return {
          id,
          title: resData.title,
          description: resData.description,
          difficulty: this.matchDifficulty(resData.difficulty),
          instructions: resData.instructions,
          ingredients: resData.ingredients,
          creatorID: resData.creatorID,
          imageURL: resData.imageURL,
        }
      }));
  }

  deleteRecipe(id: string) {
    return this.http.delete(`${environment.firebaseRDBUrl}/recipes/${id}.json?auth=${this.authService.getToken()}`)
      .pipe(
        switchMap(() => {
          return this.myRecipes;
        }),
        take(1),
        tap((recipes) => {
          this._myRecipes.next(recipes.filter((r) => r.id !== id));
        })
      )
  }

  editRecipe(id: string, title: string, description: string, ingredients: string[], instructions: string, difficulty: DifficultyLevel, creatorID: string, imageURL: string) {
    return this.http.put(`${environment.firebaseRDBUrl}/recipes/${id}.json?auth=${this.authService.getToken()}`, {
      title,
      description,
      ingredients,
      instructions,
      creatorID,
      difficulty,
      imageURL,
    }).pipe(
      switchMap(() => this.myRecipes),
      take(1),
      tap((recipes) => {
        const updatedRecipeIndex = recipes.findIndex((r) => r.id === id);
        const updatedRecipes = [...recipes];
        updatedRecipes[updatedRecipeIndex] = {
          id,
          title,
          description,
          ingredients,
          instructions,
          difficulty,
          creatorID,
          imageURL,
        };

        this._myRecipes.next(updatedRecipes);
      })
    );
  }

  matchDifficulty(difficulty: string) {
    if (difficulty === 'beginner') return DifficultyLevel.Beginner;
    else if (difficulty === 'medium') return DifficultyLevel.Medium;
    else return DifficultyLevel.Chef;
  }
}
