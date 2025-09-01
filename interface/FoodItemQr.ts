export interface FoodItemQr {
    id: number;
    idUser: string;
    calories: number;
    mealType: string;
    image: string;
    date: string;
    carbohydrates: number;
    fats: number;
    proteins: number;
    quantity: number;
    title: string;
    unit?: string;
    sugar?: number;
}