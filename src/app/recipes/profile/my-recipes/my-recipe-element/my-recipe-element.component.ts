import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../../../recipe.model";

@Component({
  selector: 'app-my-recipe-element',
  templateUrl: './my-recipe-element.component.html',
  styleUrls: ['./my-recipe-element.component.scss'],
})
export class MyRecipeElementComponent  implements OnInit {

  @Input() recipe!: Recipe;

  constructor() { }

  ngOnInit() {}

}
