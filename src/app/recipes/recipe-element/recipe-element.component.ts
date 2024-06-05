import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { FavouritesService } from '../profile/favourites/favourites.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-element',
  templateUrl: './recipe-element.component.html',
  styleUrls: ['./recipe-element.component.scss'],
})
export class RecipeElementComponent implements OnInit {
  @Input() recipe!: Recipe;
  favouriteRecipeIds: string[] = [];

  constructor(private favouritesService: FavouritesService, private alertController: AlertController) {}

  ngOnInit() {
    this.loadFavourites();

    if(!this.recipe.imageURL) this.recipe.imageURL = "https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg";
  }

  loadFavourites() {
    this.favouritesService.getFavourites().subscribe((favouriteIds) => {
      this.favouriteRecipeIds = favouriteIds || [];
    });
  }

  isFavourite(recipeId: string): boolean {
    return this.favouriteRecipeIds.includes(recipeId);
  }

  toggleFavourite(recipeId: string) {
    event.stopPropagation();

    if (this.isFavourite(recipeId)) {
      this.favouritesService.removeFromFavourites(recipeId).subscribe(() => {
        this.favouriteRecipeIds = this.favouriteRecipeIds.filter(
          (id) => id !== recipeId
        );
        console.log(`Removed from favourites: ${recipeId}`);
        this.showAlert(`Removed from Favourites`, `"${this.recipe.title}" is removed from Favourite Recipes.`);
      });
    } else {
      this.favouritesService.addToFavourites(recipeId).subscribe(() => {
        this.favouriteRecipeIds.push(recipeId);
        console.log(`Added to favourites: ${recipeId}`);
        this.showAlert(`Added to Favourites`, `"${this.recipe.title}" is added to Favourite Recipes.`);
      });
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
