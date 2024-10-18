// a supprimer fait office de mock deurant la phase dev, la structure a changer en plus simple
export interface FoodItem {
    id: number;
    name: string;
    image: string;
    description: string;
    category: string;
    notes: string;
    userMealId?: string;
    calories: number;
    unit: string;
    quantity: number;
    carbohydrates:number;
    proteins:number;
    fats: number;
    sugar: number;
    vitaminA?: number;
    vitaminB1?:number;
    vitaminB5?:number;
    vitaminB6?:number;
    vitaminB12?:number;
    vitaminC?:number;
    vitaminD?:number;
    folate?:number;
    vitaminE?: number;
    vitaminK?:number;
    potassium?:number;
    magnesium?: number;
    calcium?:number;
    sodium?: number;
    iron?: number;
    cholesterol?: number;
}