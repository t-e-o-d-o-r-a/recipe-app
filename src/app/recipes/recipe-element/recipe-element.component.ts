import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { FavouritesService } from '../profile/favourites/favourites.service';

@Component({
  selector: 'app-recipe-element',
  templateUrl: './recipe-element.component.html',
  styleUrls: ['./recipe-element.component.scss'],
})
export class RecipeElementComponent implements OnInit {
  @Input() recipe!: Recipe;
  favouriteRecipeIds: string[] = [];

  constructor(private favouritesService: FavouritesService) {}

  ngOnInit() {
    this.loadFavourites();
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
      });
    } else {
      this.favouritesService.addToFavourites(recipeId).subscribe(() => {
        this.favouriteRecipeIds.push(recipeId);
        console.log(`Added to favourites: ${recipeId}`);
      });
    }
  }
}
