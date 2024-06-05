import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ViewWillEnter} from "@ionic/angular";
import {RecipeModalComponent} from "./recipe-modal/recipe-modal.component";
import {RecipesService} from "../../recipes.service";
import {Recipe} from "../../recipe.model";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
})
export class MyRecipesPage implements OnInit, ViewWillEnter, OnDestroy {

  myRecipes: Recipe[] = [];
  private myRecipeSub: Subscription;

  constructor(private modalCtrl: ModalController, private recipeService: RecipesService, private router: Router) { }

  ngOnInit() {
    this.myRecipeSub = this.recipeService.myRecipes.subscribe((recipes) => {
      console.log(recipes);
      this.myRecipes = recipes;
    })
  }
  ionViewWillEnter() {
    this.recipeService.getMyRecipes().subscribe();
  }

  openModal() {
    this.modalCtrl.create({
      component: RecipeModalComponent,
      componentProps: {title: 'Add Recipe'}
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if(resultData.role === 'confirm') {
        console.log(resultData);

        let {title, description, ingredients, instructions, difficulty, imageURL} = resultData.data.recipeData;
        this.recipeService.addRecipe(title, description, ingredients, instructions, difficulty, imageURL).subscribe((res) => {
          console.log(res)

        });
      }

    });
  }

  ngOnDestroy() {
    if(this.myRecipeSub) {
      this.myRecipeSub.unsubscribe();
    }
  }

}
