import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RecipesService} from "../../recipes.service";
import {DifficultyLevel, Recipe} from "../../recipe.model";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {
  recipe: Recipe = {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with creamy sauce and crispy bacon.',
    ingredients: ['200g spaghetti', '2 eggs', '100g pancetta or bacon', '50g grated Parmesan cheese', '2 cloves garlic', 'Salt and black pepper'],
    instructions: [
      'Cook spaghetti according to package instructions.',
      'In a separate pan, cook pancetta until crispy.',
      'In a bowl, whisk together eggs, Parmesan cheese, minced garlic, salt, and pepper.',
      'Drain spaghetti and immediately add to the pan with pancetta.',
      'Remove from heat and quickly stir in the egg mixture until creamy.',
      'Serve hot with extra Parmesan cheese and black pepper.'
    ],
    difficulty: DifficultyLevel.Chef,
    imageURL: 'https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg',
    creatorID: 'user123',
  };

  constructor(private route: ActivatedRoute, private recipesService: RecipesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.recipe = this.recipesService.getRecipe(paramMap.get('recipeId'));
    });
  }

}
