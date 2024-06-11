import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavouritesPage } from './favourites.page';

const routes: Routes = [
  {
    path: '',
    component: FavouritesPage
  },
  {
    path: ':recipeId',
    loadChildren: () => import('../../explore/recipe-details/recipe-details.module').then( m => m.RecipeDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritesPageRoutingModule {}
