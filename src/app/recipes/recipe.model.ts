export enum DifficultyLevel {
  Beginner = 'beginner',
  Medium = 'medium',
  Chef = 'chef',
}
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  difficulty: DifficultyLevel;
  imageURL: string;
  creatorID: string;
}
