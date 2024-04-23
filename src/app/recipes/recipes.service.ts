import { Injectable } from '@angular/core';
import {DifficultyLevel, Recipe} from "./recipe.model";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipes: Recipe[] = [
    {
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
    },
    {
      id: '2',
      title: 'Vegetable Stir-Fry',
      description: 'A quick and healthy stir-fry recipe loaded with colorful vegetables and tofu.',
      ingredients: ['1 block tofu', '2 cups mixed vegetables (bell peppers, broccoli, carrots)', '2 cloves garlic', '3 tbsp soy sauce', '1 tbsp sesame oil', '1 tsp cornstarch', 'Cooking oil'],
      instructions: [
        'Press tofu to remove excess water, then cut into cubes.',
        'Heat oil in a pan and fry tofu until golden brown. Set aside.',
        'In the same pan, stir-fry mixed vegetables and minced garlic until tender-crisp.',
        'In a small bowl, mix soy sauce, sesame oil, and cornstarch.',
        'Add tofu back to the pan and pour the sauce over the vegetables.',
        'Cook until sauce thickens and coats the tofu and vegetables.',
        'Serve hot with rice or noodles.'
      ],
      difficulty: DifficultyLevel.Medium,
      imageURL: 'https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg',
      creatorID: 'user123',
    },
    {
      id: '3',
      title: 'Chocolate Chip Cookies',
      description: 'Homemade chocolate chip cookies that are soft, chewy, and irresistible.',
      ingredients: ['1 cup butter, softened', '3/4 cup brown sugar', '3/4 cup white sugar', '2 eggs', '1 tsp vanilla extract', '2 1/4 cups all-purpose flour', '1 tsp baking soda', '1/2 tsp salt', '2 cups chocolate chips'],
      instructions: [
        'Preheat oven to 350°F (175°C) and line baking sheets with parchment paper.',
        'In a large bowl, cream together softened butter, brown sugar, and white sugar until smooth.',
        'Beat in eggs one at a time, then stir in vanilla extract.',
        'Combine flour, baking soda, and salt; gradually stir into the creamed mixture.',
        'Fold in chocolate chips.',
        'Drop dough by rounded spoonfuls onto prepared baking sheets.',
        'Bake for 10 to 12 minutes in the preheated oven, or until edges are golden brown.',
        'Allow cookies to cool on baking sheet for 5 minutes before transferring to a wire rack to cool completely.'
      ],
      difficulty: DifficultyLevel.Beginner,
      imageURL: 'https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg',
      creatorID: 'user123',
    },
  ];

  constructor() { }

  getRecipe(id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }
}
