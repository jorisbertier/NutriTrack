import { Image, StyleSheet, Platform, Button, Alert, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
import { Auth, firestore } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
// import auth from '@react-native-firebase/auth';
import { useState, useEffect } from 'react';
import { User } from '@/interface/User';
import Search from '@/screens/Search';

export default function HomeScreen() {

  const navigation = useNavigation();
  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user !== null) {
        // The user object has basic properties su
        const email = user.email;
        const uid = user.uid;

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
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    // >
    <>
      <View style={styles.titleContainer}>
        <ThemedText>Welcome! {userData[0]?.name}</ThemedText>
        <ThemedText>Weight: {userData[0]?.weight} kg</ThemedText>
        <ThemedText>Height: {userData[0]?.name} cm</ThemedText>
        <ThemedText>NumeroId: {userData[0]?.id} </ThemedText>
        <HelloWave />
      </View>
      <View style={styles.stepContainer}>
        <ThemedText>Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText>app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText>
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </View>
      <View style={styles.stepContainer}>
        <Button title="Se déconnecter" onPress={handleSignOut} />
      </View>
      <View>
        <Button title="Search" onPress={() => navigation.navigate('search')}/>
      </View>
      <View>
        <Button title="Dashboard" onPress={() => navigation.navigate('dashboard')}/>
      </View>
      </>
    // </ParallaxScrollView>
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
