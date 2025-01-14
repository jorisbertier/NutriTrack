export interface User {
    id: string;
    email: string;
    name: string;
    gender?: string;
    firstName: string;
    dateOfBirth: string;
    height: number;
    weight: number; 
    activityLevel: string;
    profilPicture: string;
    xp: number;
    level: number;
    xpLogs?: any;
    consumeByDays?: any;
    proteinsTotal?: any;
    carbsTotal?: any;
    fatsTotal?: any;
}