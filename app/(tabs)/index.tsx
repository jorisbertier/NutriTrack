import { Image, StyleSheet, Button, Alert, View, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Auth, firestore } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { User } from '@/interface/User';
import Row from '@/components/Row';
import NutritionalCard from '@/components/NutritionCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import useThemeColors from '@/hooks/useThemeColor';
import { calculAge, BasalMetabolicRate, calculProteins, calculFats } from '@/functions/function';
import { calculCarbohydrates } from '../../functions/function';
import Banner from '@/components/Banner';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {

  const colors = useThemeColors()
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
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
          gender: doc.data().gender,
          height: doc.data().height,
          weight: doc.data().weight,
          activityLevel: doc.data().activityLevel,
          profilPicture: doc.data().profilPicture,
        }));

        const sortByUniqueUserConnected = userList.filter((user) => user.email === email);
        setUserData(sortByUniqueUserConnected)
        setIsLoading(true)
      }
    }
    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(Auth); // Déconnexion de l'utilisateur
      navigation.navigate('auth'); // Redirige vers la page de connexion après la déconnexion
    } catch (error: any) {
      Alert.alert('Erreur de déconnexion', error.message);
    }
  };

  const basalMetabolicRate = userData.length > 0 ? BasalMetabolicRate(
    Number(userData[0]?.weight),
    Number(userData[0]?.height),
    Number(calculAge(userData[0]?.dateOfBirth)),
    userData[0]?.gender,
    userData[0]?.activityLevel
  ) : null;

  // const [formattedCalories, setFormattedCalories] = useState('')
  // useEffect(() => {
  //   if (typeof basalMetabolicRate === 'number' && !isNaN(basalMetabolicRate)) {
  //     setFormattedCalories(basalMetabolicRate.toLocaleString('en-US'));
  //   } else {
  //     console.error('basalMetabolicRate is not a valid number');
  //   }
  // }, [basalMetabolicRate]); 

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Banner name={userData[0]?.name}/>
      
      <SafeAreaView style={styles.header}>
        {/* <Banner/> */}
          <Row gap={5} style={styles.rowTwoItems}>
            <NutritionalCard
            nutritionalName={'calories'}
            nutrionalData={basalMetabolicRate}
            icon={'burn'}
            backgroundcolor={colors.gray}
            indice={'kcal'}
            />
            <NutritionalCard
            nutritionalName={'protein'}
            nutrionalData={calculProteins(Number(userData[0]?.weight))}
            backgroundcolor={colors.black}
            indice={'g'}
            icon={'protein'}
            textColor={'white'}
            />
            <NutritionalCard
            nutritionalName={'carbs'}
            nutrionalData={calculCarbohydrates(basalMetabolicRate)}
            backgroundcolor={colors.blue}
            indice={'g'}
            icon={'carbs'}
            />
            <NutritionalCard
            nutritionalName={'fat'}
            nutrionalData={calculFats(basalMetabolicRate)}
            backgroundcolor={colors.blueLight}
            indice={'g'}
            icon={'fat'}
            />
          </Row>
          <Row>
            {/* <ProgressBar progress={60}/> */}
          </Row>
          <View style={styles.stepContainer}>
            <Button color={colors.primary} title="Log out" onPress={handleSignOut} />
          </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: 'white',
    flex: 1
  },
  rowTwoItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 30
  },
    stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

})
