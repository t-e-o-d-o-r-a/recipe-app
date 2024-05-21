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
  private recipeSub: Subscription;

  constructor(private recipesService: RecipesService, private authService: AuthService) {
  }

  ngOnInit() {
    this.recipeSub = this.recipesService.recipes.subscribe((recipes) => {
      console.log(recipes);
      this.recipes = recipes;
    });
  }

  ionViewWillEnter() {
    this.recipesService.getRecipes().subscribe();
  }

  handleChange(event) {
    if (event.detail.value==='all') {
      //this.recipes = this.recipesService.recipes;
    }
    else {
      //this.recipes = this.recipesService.recipes.filter((recipe) => recipe.difficulty===event.detail.value)
    }
  }

  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }

}
