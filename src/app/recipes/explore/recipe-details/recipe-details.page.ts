import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RecipesService} from "../../recipes.service";
import {DifficultyLevel, Recipe} from "../../recipe.model";
import {LoadingController, NavController} from "@ionic/angular";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit, OnDestroy {
  recipe: Recipe;

  isLoading: boolean = false;
  private recipeSub: Subscription;

  source: string;

  constructor(private route: ActivatedRoute, private recipesService: RecipesService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      //this.recipe = this.recipesService.getRecipe(paramMap.get('recipeId'));
      if(!paramMap.has("recipeId")) {
        this.navCtrl.navigateBack("recipes/tabs/explore");
        return;
      }

      this.isLoading = true;
      this.recipeSub = this.recipesService.getRecipe(paramMap.get('recipeId')).subscribe(
        (recipe) => {
          this.recipe = recipe;
          this.isLoading = false;
        }
      );
    });

    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
    });
  }

  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }
}
