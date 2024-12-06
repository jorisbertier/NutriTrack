export interface FoodItemCreated {
    idfirestore?: string;
    originalMealId?: string;
    idDoc?: string;
    id: string;
    idUser: number;
    title: string;
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
    quantity: number;
    unit: string;
}