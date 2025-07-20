import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {DifficultyLevel} from "../../../recipe.model";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent  implements OnInit {

  newIngredient: string;
  ingredients: string[] = [];
  imageDataUrl: string = '';

  //referenca na formu
  @ViewChild('f', {static: true}) form: NgForm;
  @Input() title: string;
  @Input() recipeTitle: string;
  @Input() description: string;
  @Input() instructions: string;
  @Input() difficulty: DifficultyLevel;
  @Input() imageURL:  string;

  constructor(private modalCtrl: ModalController) {
    this.newIngredient = '';
  }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onAddRecipe() {
    if(!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss({recipeData: {
        title: this.form.value['title'],
        description: this.form.value['description'],
        instructions: this.form.value['instructions'],
        difficulty: this.matchDifficulty(this.form.value['difficulty']),
        ingredients: this.ingredients,
        imageURL: this.imageDataUrl ? this.imageDataUrl : this.imageURL,
      }}, 'confirm');
  }

  addIngredient() {
    if(this.newIngredient.trim() !== '') {
      this.ingredients.push(this.newIngredient.trim());
      this.newIngredient = '';
    }
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1)
  }

  matchDifficulty(difficulty) {
    if (difficulty.toLowerCase() === 'beginner') return DifficultyLevel.Beginner;
    else if (difficulty.toLowerCase() === 'medium') return DifficultyLevel.Medium;
    else return DifficultyLevel.Chef;
  }

  async selectImage() {
    //console.log('biraj sliku');
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Camera ili Gallery
    });

    this.imageDataUrl = image.dataUrl!;

    //console.log('slika' + this.imageDataUrl);
  }


}
