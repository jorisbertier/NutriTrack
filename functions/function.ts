import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase user type
import { getAuth } from "firebase/auth";

export function capitalizeFirstLetter(name: string) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

//to use with useEffect
export const fetchUserIdDataConnected = async (user: FirebaseUser | null, setUser: React.Dispatch<React.SetStateAction<number | undefined>>) => {
    
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
        setUser(sortByUniqueUserConnected[0].index)
    }
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
    let proteins = (weight = weight * 1.6).toFixed(1)
    return proteins
}

//Lipides
export function calculFats(calories: number) {
    let fats = 0.30 * calories
    fats = fats / 9
    return fats.toFixed(1)
}
//Glucides
export function calculCarbohydrates(calories: number) {
    let carbs = 0.55 * calories
    carbs = carbs / 4
    return carbs.toFixed(1)
}