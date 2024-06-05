export enum DifficultyLevel {
  Beginner = 'beginner',
  Medium = 'medium',
  Chef = 'chef',
}
export class Recipe {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public ingredients: string[],
    public instructions: string,
    public difficulty: DifficultyLevel,
    public creatorID: string,
    public imageURL: string = "https://design4users.com/wp-content/uploads/2023/03/food-illustration-by-helen-lee.jpg",
  ) {}
}
