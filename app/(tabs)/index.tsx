import { Image, StyleSheet, Platform, Button, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Auth, firestore } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
// import auth from '@react-native-firebase/auth';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  dateOfBirth: string;
  height: number;
  weight: number; 
  activityLevel: string;
  profilPicture: string;
}

export default function HomeScreen() {

  const navigation = useNavigation();
  const [email, setEmail] = useState<string | null>(null)
  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user !== null) {
        // The user object has basic properties su
        const email = user.email;
      
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
        console.log(user)
        setEmail(user.email)
        const userCollection = collection(firestore, 'User');
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
          firstName: doc.data().firstName,
          dateOfBirth: doc.data().dateOfBirth,
          height: doc.data().height,
          weight: doc.data().weight,
          activityLevel: doc.data().activityLevel,
          profilPicture: doc.data().profilPicture,
        }));
        const sortByUniqueUserConnected = userList.filter((user) => user.email === email);
        setUserData(sortByUniqueUserConnected)
        console.log("User trie", typeof sortByUniqueUserConnected)
        console.log(sortByUniqueUserConnected)
      }
    }
    fetchUserData()
  }, [])


  const handleSignOut = async () => {
    try {
      await signOut(Auth); // Déconnexion de l'utilisateur
      navigation.navigate('auth'); // Redirige vers la page de connexion après la déconnexion
    } catch (error) {
      Alert.alert('Erreur de déconnexion', error.message);
    }
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome! {userData[0]?.name}</ThemedText>
        <ThemedText type="title">Weight: {userData[0]?.weight} kg</ThemedText>
        <ThemedText type="title">Height: {userData[0]?.name} cm</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Button title="Se déconnecter" onPress={handleSignOut} />
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
