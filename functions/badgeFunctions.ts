import { badgeRules } from "../badge/badges";

export const checkCaloriesBadges = (totalCalories: number) => {
    return badgeRules.calories
        .filter(badge => totalCalories >= badge.threshold)
        .map(badge => badge.id);
};