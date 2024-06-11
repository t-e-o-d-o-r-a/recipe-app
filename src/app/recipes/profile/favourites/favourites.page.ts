import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { FavouritesService } from './favourites.service';
import { RecipesService } from '../../recipes.service';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {
  favouriteRecipeIds: string[];
  favouriteRecipes: Recipe[] = [];

  constructor(
    private favouritesService: FavouritesService,
    private recipesService: RecipesService,
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadFavouriteRecipes();
  }

  ionViewWillEnter() {
    this.loadFavouriteRecipes();
  }

  loadFavouriteRecipes() {
    this.favouritesService.getFavourites().subscribe((favouriteIds) => {
      this.favouriteRecipeIds = favouriteIds;
      this.recipesService.getRecipes().subscribe((recipes) => {
        this.favouriteRecipes = recipes.filter((recipe) =>
          this.favouriteRecipeIds.includes(recipe.id)
        );
      });
    });
  }

  openRecipeDetails(recipeId: string) {
    this.router.navigate(['/recipes/tabs/profile/favourites', recipeId], { queryParams: { source: 'favourites' } });
  }

  async removeFromFavourites(recipeId: string) {
    const alert = await this.alertController.create({
      header: 'Remove from Favourites',
      message: 'Are you sure you want to remove this recipe from favourites?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Remove',
          handler: () => {
            this.favouritesService.removeFromFavourites(recipeId).subscribe(() => {
              this.favouriteRecipes = this.favouriteRecipes.filter((recipe) => recipe.id !== recipeId);
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
}
