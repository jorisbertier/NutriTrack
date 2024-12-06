export interface UserMeals {
    id: string;
    userId: number;
    foodId: number;
    date: string;
    mealType: string;
}
export interface UserMealsCreated {
    id: string;
    userId: number;
    foodId: string;
    date: string;
    mealType: string;
}