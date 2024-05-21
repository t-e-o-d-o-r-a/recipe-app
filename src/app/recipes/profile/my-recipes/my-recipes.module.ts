import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRecipesPageRoutingModule } from './my-recipes-routing.module';

import { MyRecipesPage } from './my-recipes.page';
import {RecipeModalComponent} from "./recipe-modal/recipe-modal.component";
import {MyRecipeElementComponent} from "./my-recipe-element/my-recipe-element.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRecipesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MyRecipesPage, RecipeModalComponent, MyRecipeElementComponent],
})
export class MyRecipesPageModule {}
