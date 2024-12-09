export interface FoodItemCreated {
    idfirestore?: string;
    originalMealId?: string;
    idDoc?: string;
    id: string;
    idUser: number;
    title: string;
    calories: number;
    carbohydrates: number;
    fats: number;
    proteins: number;
    quantity: number;
    unit: string;
}