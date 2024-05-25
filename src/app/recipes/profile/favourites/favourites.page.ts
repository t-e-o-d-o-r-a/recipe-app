import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { FavouritesService } from './favourites.service';
import { RecipesService } from '../../recipes.service';
import { Router } from '@angular/router';

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
    private router: Router
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
    this.router.navigate(['/recipes/tabs/explore', recipeId], { queryParams: { source: 'favourites' } });
  }
}
