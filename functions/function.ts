import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth"; // Import Firebase user type

export function capitalizeFirstLetter(name: string) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export const fetchUserDataConnected = async (user: FirebaseUser | null, setUser: React.Dispatch<React.SetStateAction<number>>) => {
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