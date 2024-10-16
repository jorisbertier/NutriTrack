export interface Food {
    id: string;
    name: string;
    image: string;
    category: string;
    description: string;
    notes?: string;
    quantity: number; 
    unit: string;
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    vitaminA?: number;
    vitaminB1?: number;
    vitaminB6?: number;
    vitaminB12?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    folate?: number;
    potassium?: number;
    magnesium?: number;
    calcium?: number;
    iron?: number;
}