import { Injectable } from '@angular/core';
import {DifficultyLevel, Recipe} from "./recipe.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, map, Observable, switchMap, take, tap, of} from "rxjs";
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

  addRecipe(title: string, description: string, ingredients: string[], instructions: string, difficulty: DifficultyLevel, imageURL: string | null) {
    let generatedId: string;
    let userId: string = this.authService.getUserId();

    let upload: Observable<string>;

    if (imageURL) {
      upload = this.uploadImageToImgbb(imageURL);
    } else {
      upload = of(''); // ako nema slike vratice prazan string
    }

    return upload.pipe(
    switchMap((imageURL) => {
      return this.http.post<{ name: string }>(
        `${environment.firebaseRDBUrl}/recipes.json?auth=${this.authService.getToken()}`,
        {
          title,
          description,
          ingredients,
          instructions,
          difficulty,
          creatorID: userId,
          imageURL: imageURL || 'https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg',
        }
      );
    }),
    switchMap((resData) => {
      generatedId = resData.name;
      return this.myRecipes;
    }),
    take(1),
    tap((recipes) => {
      this._myRecipes.next(
        recipes.concat({
          id: generatedId,
          title,
          description,
          ingredients,
          instructions,
          creatorID: userId,
          difficulty,
          imageURL: imageURL || 'https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg',
        })
      );
    })
  );
    
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

  editRecipe(id: string, title: string, description: string, ingredients: string[], instructions: string, difficulty: DifficultyLevel, creatorID: string, imageURL: string | null) {
    let upload: Observable<string>;

    const existingRecipe = this._recipes.getValue().find(r => r.id === id);
    const originalImageURL = existingRecipe?.imageURL;

    const shouldUpload = imageURL && imageURL !== originalImageURL;

    if (shouldUpload) {
      upload = this.uploadImageToImgbb(imageURL);
    } else {
      upload = of(imageURL || 'https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg');
    }

    let image;
    return upload.pipe(
      switchMap((finalImageURL) => {
        image = finalImageURL;
        return this.http.put(`${environment.firebaseRDBUrl}/recipes/${id}.json?auth=${this.authService.getToken()}`, {
          title,
          description,
          ingredients,
          instructions,
          creatorID,
          difficulty,
          imageURL: finalImageURL,
        } 
      ); 
    }),
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
          imageURL: image,
        };

        this._myRecipes.next(updatedRecipes);
      })
    );
  }

  matchDifficulty(difficulty: string) {
    if (difficulty.toLowerCase() === 'beginner') return DifficultyLevel.Beginner;
    else if (difficulty.toLowerCase() === 'medium') return DifficultyLevel.Medium;
    else return DifficultyLevel.Chef;
  }

  uploadImageToImgbb(base64Image: string): Observable<string> {
    const apiKey = '';
    const formData = new FormData();

    const base64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
    formData.append('image', base64);

    return this.http
      .post<any>(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData)
      .pipe(map((res) => res.data.url));
  }

}
