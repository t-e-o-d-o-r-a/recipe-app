import {Component, OnDestroy, OnInit} from '@angular/core';
import {DifficultyLevel, Recipe} from "../recipe.model";
import {RecipesService} from "../recipes.service";
import {Subscription} from "rxjs";
import {ViewWillEnter} from "@ionic/angular";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit, OnDestroy, ViewWillEnter {

  recipes: Recipe[];
  allRecipes: Recipe[];
  beginnerRecipes: Recipe[];
  mediumRecipes: Recipe[];
  chefRecipes: Recipe[];
  private recipeSub: Subscription;

  constructor(private recipesService: RecipesService, private authService: AuthService) {
  }

  ngOnInit() {
    this.recipeSub = this.recipesService.recipes.subscribe((recipes) => {
      console.log(recipes);
      this.allRecipes = recipes;
      this.recipes = this.allRecipes;
    });
  }

  ionViewWillEnter() {
    this.recipesService.getRecipes().subscribe();
  }

  handleChange(event) {
    if (event.detail.value==='all') {
      this.recipes = this.allRecipes;
    }
    else {
      this.recipes = this.allRecipes.filter((recipe) => recipe.difficulty===event.detail.value)
    }
  }

  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }

}
