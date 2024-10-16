import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase user type
import { getAuth } from "firebase/auth";

export function capitalizeFirstLetter(name: string) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

//to use with useEffect
export const fetchUserDataConnected = async (user: FirebaseUser | null, setUser: React.Dispatch<React.SetStateAction<number | undefined>>) => {
    
    if (user !== null) {
        const email = user.email;
        const userCollection = collection(firestore, 'User');
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map((doc, index) => ({
            index: index + 1,
            id: doc.id,
            email: doc.data().email,
        }));
        const sortByUniqueUserConnected = userList.filter((user) => user.email === email);
        setUser(sortByUniqueUserConnected[0].index)
    }
}
//to use with useEffect
export const fetchUserDataConnected2 = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
        const email = user.email;
        try {
            const userCollection = collection(firestore, 'User');
            const userSnapshot = await getDocs(userCollection);

            // Construire la liste des utilisateurs
            const userList = userSnapshot.docs.map((doc, index) => ({
                index: index + 1,
                id: doc.id,
                email: doc.data().email,
            }));

            const connectedUser = userList.find((u) => u.email === email);

            if (connectedUser) {
                return connectedUser;
            } else {
                console.log('Utilisateur connecté non trouvé dans la collection.');
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur: ", error);
            return null;
        }
    } else {
        console.log("Aucun utilisateur n'est actuellement connecté.");
        return null;
    }
};