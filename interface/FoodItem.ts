// a supprimer fait office de mock deurant la phase dev, la structure a changer en plus simple
export interface FoodItem {
    id: number;
    name: string;
    image: string;
    description: string;
    category: string;
    notes: string;
    nutrition: {
        calories: string;
        servingSize: {
            unit: string;
            quantity: number;
        },
        macronutrients: {
            carbohydrates: {
                total: number;
                unit: string;
                fiber: number;
            },
            proteins: {
                total: number;
                unit: string;
            },
            fats: {
                total: number;
                unit: string;
            },
        },
        vitamins? : {
            vitaminA?: {
                amount: number;
                unit: string;
            },
            vitaminC?: {
                amount: number;
                unit: string;
            },
            vitaminB1?: {
                amount: number;
                unit: string;
            },
            vitaminB6?: {
                amount: number;
                unit: string;
            },
            vitaminB12?: {
                amount: number;
                unit: string;
            },
            vitaminD?: {
                amount: number;
                unit: string;
            },
            folate?: {
                amount: number;
                unit: string;
            },
            vitaminE?: {
                amount: number;
                unit: string;
            },
            vitaminK?: {
                amount: number;
                unit: string;
            },
        },
        minerals?: {
            potassium?: {
                amount: number;
                unit: string;
            },
            magnesium?: {
                amount: number;
                unit: string;
            },
            calcium?: {
                amount: number;
                unit: string;
            },
            iron?: {
                amount: number;
                unit: string;
            }
        }
    };
}