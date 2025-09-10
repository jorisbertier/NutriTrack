export const badgeRules = {
    calories: [
        { id: "calories_1000", threshold: 1000, label: "🔥 1 000 calories" },
        { id: "calories_5000", threshold: 5000, label: "🔥 5 000 calories" },
        { id: "calories_10000", threshold: 10000, label: "🔥 10 000 calories" },
        { id: "calories_100000", threshold: 100000, label: "🔥 100 000 calories" },
    ],
    meals: [
        { id: "meals_10", threshold: 10, label: "🍽️ 10 repas enregistrés" },
        { id: "meals_50", threshold: 50, label: "🍽️ 50 repas enregistrés" },
        { id: "meals_100", threshold: 100, label: "🍽️ 100 repas enregistrés" },
    ],
    protein: [
        { id: "protein_50", threshold: 50, label: "💪 50g de protéines consommées" },
        { id: "protein_200", threshold: 200, label: "💪 200g de protéines consommées" },
    ],
    hydration: [
        { id: "water_1L", threshold: 1000, label: "💧 1L d'eau bue" },
        { id: "water_5L", threshold: 5000, label: "💧 5L d'eau bue" },
    ],
    fruitsVeggies: [
        { id: "fv_5", threshold: 5, label: "🥗 5 portions de fruits/légumes" },
        { id: "fv_20", threshold: 20, label: "🥗 20 portions de fruits/légumes" },
    ],
    sugar: [
        { id: "sugar_10", threshold: 10, label: "🍬 10g de sucre limité" },
    ],
    streak: [
        { id: "streak_3", threshold: 3, label: "🔥 3 jours consécutifs d'enregistrement" },
    ],
    weightTracking: [
        { id: "weight_logged", threshold: 1, label: "⚖️ Premier poids enregistré" },
    ],
};