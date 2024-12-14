import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase user type
import { Animated } from "react-native";
import { FoodItem } from '../interface/FoodItem';

export function capitalizeFirstLetter(name: string) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export const fetchUserDataConnected = async (user: FirebaseUser | null, setUser: React.Dispatch<React.SetStateAction<any>>) => {
    if (user !== null) {
        const email = user.email;

        const userCollection = collection(firestore, 'User');
        const userSnapshot = await getDocs(userCollection);

        const userList = userSnapshot.docs.map((doc, index) => ({
            index: index + 1,
            id: doc.id,
            email: doc.data().email,
            name: doc.data().name,
            firstName: doc.data().firstName,
            dateOfBirth: doc.data().dateOfBirth,
            gender: doc.data().gender,
            height: doc.data().height,
            weight: doc.data().weight,
            activityLevel: doc.data().activityLevel,
            profilPicture: doc.data().profilPicture,
        }));
        const sortByUniqueUserConnected = userList.filter((user) => user.email === email);
        setUser(sortByUniqueUserConnected)
    }
}

//to use with useEffect
// export const fetchUserDataConnected = async () => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user !== null) {
//         const email = user.email;
//         try {
//             const userCollection = collection(firestore, 'User');
//             const userSnapshot = await getDocs(userCollection);

//             // Construire la liste des utilisateurs
//             const userList = userSnapshot.docs.map((doc, index) => ({
//                 index: index + 1,
//                 id: doc.id,
//                 email: doc.data().email,
//             }));

//             const connectedUser = userList.find((u) => u.email === email);

//             if (connectedUser) {
//                 return connectedUser;
//             } else {
//                 console.log('Utilisateur connecté non trouvé dans la collection.');
//                 return null;
//             }
//         } catch (error) {
//             console.error("Erreur lors de la récupération des données utilisateur: ", error);
//             return null;
//         }
//     } else {
//         console.log("Aucun utilisateur n'est actuellement connecté.");
//         return null;
//     }
// };

export function calculAge(dateOfBirthStr: string) {
    // Séparer la date en jour, mois et année
    const [day, month, year] = dateOfBirthStr.split('/').map(Number);
    // Créer un objet Date à partir de la date de naissance
    const dateOfBirth = new Date(year, month - 1, day); // Les mois dans JavaScript commencent à 0
    // Obtenir la date actuelle
    const currentDate = new Date();
    // Calculer l'âge en années
    let age = currentDate.getFullYear() - dateOfBirth.getFullYear();
    // Ajuster l'âge si la date anniversaire n'a pas encore été atteinte cette année
    const monthBirthdayNotReached = (currentDate.getMonth() < (month - 1));
    const dayBirthdayNotReached = (currentDate.getMonth() === (month - 1) && currentDate.getDate() < day);

    if (monthBirthdayNotReached || dayBirthdayNotReached) {
        age--;
    }
    return age;
}

export function BasalMetabolicRate(weight:number, height:number, age: number, gender: string | undefined, activity:string) {

    gender = gender?.toLocaleLowerCase();
    activity = activity.toLocaleLowerCase();
    let multiplicateur = 0;

    switch (activity) {
        case 'sedentary':
            multiplicateur = 1.2;
            break;
        case 'lowactive':
            multiplicateur = 1.375;
            break;
        case 'moderate':
            multiplicateur = 1.55;
            break;
        case 'active':
            multiplicateur = 1.725;
            break;
        case 'superactive':
            multiplicateur = 1.9;
            break;
        default:
    }

    if(gender === "male") {
        let brm = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677* age);
        brm = brm * multiplicateur;
        return Math.round(brm)
    } else {
        let brm = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        brm = brm * multiplicateur;
        return Math.round(brm)
    }
}

export function calculProteins(weight: number) {
    return parseFloat((weight * 1.6).toFixed(1));
}

//Lipides
export function calculFats(calories: number) {
    let fats = 0.30 * calories
    fats = fats / 9
    return parseFloat(fats.toFixed(1))
}
//Glucides
export function calculCarbohydrates(calories: number) {
    let carbs = 0.55 * calories
    carbs = carbs / 4
    return parseFloat(carbs.toFixed(1))
}

export const getTotalNutrient = (resultAllDataFood: any, nutrientKey: keyof FoodItem, setNutrient: any, resultAllDataFoodCreated?: any) => {
    const result = resultAllDataFood.reduce((acc:number,  item: FoodItem) => {
        const nutrientValue = typeof item[nutrientKey] === 'number' ? item[nutrientKey] : 0;
        return acc + nutrientValue;
    }, 0) || 0;

    // console.log('ici', resultCreated)
    const resultCreated = resultAllDataFoodCreated?.reduce((acc:number,  item: FoodItem) => {
        const nutrientValue = typeof item[nutrientKey] === 'number' ? item[nutrientKey] : 0;
        return acc + nutrientValue;
    }, 0) || 0;

    // console.log(nutrientKey)

    const formattedResult = parseFloat(result.toFixed(2));

        const formattedResultCreated = parseFloat(resultCreated?.toFixed(2));

    switch (nutrientKey) {
        case 'magnesium':
            setNutrient(result + formattedResultCreated);
            break;
        case 'potassium':
            setNutrient(result + formattedResultCreated);
            break;
        case 'calcium':
            setNutrient(result + formattedResultCreated);
            break;
        case 'sodium':
            setNutrient(result + formattedResultCreated);
            break;
        case 'iron':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminA':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminB1':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminB5':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminB6':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminB12':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminC':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminD':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminE':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'vitaminK':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'folate':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'sugar':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'carbohydrates':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'proteins':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        case 'fats':
            setNutrient(formattedResult + formattedResultCreated);
            break;
        default:
            break;
    }
}

export const calculatePercentage = (progress: number, goal: number) => {
    const percentage = +(progress / goal).toFixed(2);
    return percentage > 1 ? 1 : percentage;
};

export function getIdAvatarProfile(number: number) {
    const avatars: { [key: number]: any } = {
        1: require('@/assets/images/avatar/pinguin.png'),
        2: require('@/assets/images/avatar/bubble.png'),
        3: require('@/assets/images/avatar/watermelon.png'),
        4: require('@/assets/images/avatar/avatar.png'),
        5: require('@/assets/images/avatar/banana.webp'),
    };

    // return avatars[number] || require('@/assets/images/avatar/avatar.png');
    return avatars[number];
}

export function getVitaminPercentageUg(value: number, dailyValue: number): string {
    // AJR pour la Vitamine A (en µg) Vitamine B12 (en µg) Vitamine D (en µg) Vitamine K (en µg)
    return ((value / dailyValue) * 100).toFixed(1);
}

export function getVitaminPercentageMg(value: number, dailyValue: number): string {
    // AJR pour la Vitamine B1 (en mg) Vitamine B5 (en mg) Vitamine B6 (en mg) Vitamine C (en mg) Vitamine E (en mg)
    return ((value / dailyValue) * 100).toFixed(1);
}



/* ANIMATION */

// export const handleAnimation = (isOpenDrop: any, setIsOpenDrop: any, rotate: any) => {
//     // La valeur d'animation alterne entre 0 et 1
//     Animated.timing(rotate, {
//         toValue: rotate._value === 0 ? 1 : 0, // Alterne entre 0 et 1
//         duration: 400,
//         useNativeDriver: true,
//     }).start();
//     setIsOpenDrop(!isOpenDrop)
// };