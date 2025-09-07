export const badgeRules = {
    calories: [
        { id: "calories_1000", threshold: 1000, label: "🔥 1 000 calories" },
        { id: "calories_5000", threshold: 5000, label: "🔥 5 000 calories" },
        { id: "calories_10000", threshold: 10000, label: "🔥 10 000 calories" },
        { id: "calories_100000", threshold: 10000, label: "🔥 100 000 calories" },
    ],
};

// export const checkCaloriesBadges = (totalCalories: number) => {
//     return badgeRules.calories
//         .filter((badge) => totalCalories >= badge.threshold)
//         .map((badge) => badge.id);
// };