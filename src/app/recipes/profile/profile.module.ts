import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {FavouritesPageModule} from "./favourites/favourites.module";
import {MyRecipesPageModule} from "./my-recipes/my-recipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    FavouritesPageModule,
    MyRecipesPageModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
