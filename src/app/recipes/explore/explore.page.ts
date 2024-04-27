import { Component, OnInit } from '@angular/core';
import {DifficultyLevel, Recipe} from "../recipe.model";
import {RecipesService} from "../recipes.service";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  recipes: Recipe[];

  constructor(private recipesService: RecipesService) {
    this.recipes = recipesService.recipes;
  }

  ngOnInit() {
  }

  handleChange(event) {
    if (event.detail.value==='all') {
      this.recipes = this.recipesService.recipes;
    }
    else {
      this.recipes = this.recipesService.recipes.filter((recipe) => recipe.difficulty===event.detail.value)
    }
  }
}
