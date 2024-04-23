import {Component, Input, OnInit} from '@angular/core';
import {DifficultyLevel, Recipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-element',
  templateUrl: './recipe-element.component.html',
  styleUrls: ['./recipe-element.component.scss'],
})
export class RecipeElementComponent  implements OnInit {
  @Input() recipe!: Recipe;

  constructor() { }

  ngOnInit() {}

}
