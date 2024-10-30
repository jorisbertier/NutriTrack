import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const auth = getAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        const userCollection = collection(firestore, 'User');
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const currentUser = userList.find((u) => u.email === email);
        console.log("Current User Data:", currentUser);
        setUserData(currentUser);
      } else {
        console.log("No user is logged in."); // Ajoutez cette ligne
      }
    };
    fetchUserData();
  }, [auth]);

  const updateUserInfo = async (newInfo) => {
    if (userData) {
      const userRef = doc(firestore, 'User', userData.id); // Assurez-vous que l'ID utilisateur est correct
      await updateDoc(userRef, newInfo); // Met à jour les informations utilisateur dans Firestore
      console.log(newInfo)
      setUserData((prevData) => ({ ...prevData, ...newInfo })); // Met à jour l'état local
    }
  };

  return (
    <UserContext.Provider value={{ userData,setUserData, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
