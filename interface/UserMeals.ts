export interface UserMeals {
    id: string;
    userId: string;
    foodId: number;
    date: string;
    mealType: string;
}

export interface UserMealsCustom {
    id: string;
    userId: string;
    foodId: string;
    date: string;
    mealType: string;
    quantityCustom: number;
}

export interface UserMealsCreated {
    id: string;
    userId: string;
    foodId: string;
    date: string;
    mealType: string;
}