import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RecipesService} from "../../recipes.service";
import {DifficultyLevel, Recipe} from "../../recipe.model";
import {AlertController, LoadingController, ModalController, NavController} from "@ionic/angular";
import {Subscription} from "rxjs";
import {RecipeModalComponent} from "../../profile/my-recipes/recipe-modal/recipe-modal.component";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit, OnDestroy {
  recipe: Recipe;
  showButtons: boolean = false; //da li da prikaze dugmice za izmenu
  userId = this.auth.getUserId();

  isLoading: boolean = false;
  private recipeSub: Subscription;

  source: string;

  constructor(private route: ActivatedRoute, private recipesService: RecipesService, private navCtrl: NavController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private auth: AuthService, private alertCtrl: AlertController) { }

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
          if (!this.recipe.imageURL) this.recipe.imageURL = "https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg";
          this.isLoading = false;
          if (this.userId === recipe.creatorID) {
            this.showButtons = true;
          }
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

  async onDeleteRecipe() {
    const loading = await this.loadingCtrl.create({message: 'Deleting...'});
    await loading.present();

    this.recipesService.deleteRecipe(this.recipe.id).subscribe(async () => {
      await loading.dismiss();
      this.navCtrl.navigateBack('/recipes/tabs/profile/my-recipes');
    })
  }

  async onEditRecipe() {
    const modal= await this.modalCtrl.create({
      component: RecipeModalComponent,
      componentProps: {
        title: 'Edit recipe',
        recipeTitle: this.recipe.title,
        description: this.recipe.description,
        ingredients: this.recipe.ingredients,
        instructions: this.recipe.instructions,
        difficulty: this.recipe.difficulty,
        imageURL: this.recipe.imageURL,
      }
    });

    modal.present();

    const {data, role} = await modal.onDidDismiss();

    if (role === 'confirm') {
      const diff = this.matchDifficulty(data.recipeData.difficulty)

      this.recipesService.editRecipe(this.recipe.id, data.recipeData.title, data.recipeData.description, data.recipeData.ingredients, data.recipeData.instructions, diff, this.auth.getUserId(), data.recipeData.imageURL)
        .subscribe((res) => {
          this.recipe.title = data.recipeData.title;
          this.recipe.description = data.recipeData.description;
          this.recipe.instructions = data.recipeData.instructions;
          this.recipe.ingredients = data.recipeData.ingredients;
          this.recipe.difficulty = data.recipeData.difficulty;
          this.recipe.imageURL = data.recipeData.imageURL;
        })
    }
  }

  openAlert() {
    this.alertCtrl.create({
      header: 'Delete recipe',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.onDeleteRecipe(),
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ],
    }).then((alert) => {
      alert.present();
    });
  }

  matchDifficulty(difficulty: string) {
    if (difficulty === 'beginner') return DifficultyLevel.Beginner;
    else if (difficulty === 'medium') return DifficultyLevel.Medium;
    else return DifficultyLevel.Chef;
  }
}
