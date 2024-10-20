import { Image, StyleSheet, Platform, Button, Alert, View, Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Auth, firestore } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { User } from '@/interface/User';
import Search from '@/screens/Search';
import Row from '@/components/Row';
import NutritionalCard from '@/components/NutritionCard';
import Banner from '@/components/Banner';
import { SafeAreaView } from 'react-native-safe-area-context';
import useThemeColors from '@/hooks/useThemeColor';
import { calculAge, BasalMetabolicRate, calculProteins, calculFats, capitalizeFirstLetter } from '@/functions/function';
import { calculCarbohydrates } from '../../functions/function';

export default function HomeScreen() {

  const colors = useThemeColors()
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;
  const date = new Date();

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
  console.log(userData)


  const handleSignOut = async () => {
    try {
      await signOut(Auth); // Déconnexion de l'utilisateur
      navigation.navigate('auth'); // Redirige vers la page de connexion après la déconnexion
    } catch (error) {
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

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    // >
    // <>
    //   <View style={styles.titleContainer}>
    //     <ThemedText>Welcome! {userData[0]?.name}</ThemedText>
    //     <ThemedText>Weight: {userData[0]?.weight} kg</ThemedText>
    //     <ThemedText>Height: {userData[0]?.name} cm</ThemedText>
    //     <ThemedText>NumeroId: {userData[0]?.id} </ThemedText>
    //     <HelloWave />
    //   </View>
    //   <View style={styles.stepContainer}>
    //     <ThemedText>Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit <ThemedText>app/(tabs)/index.tsx</ThemedText> to see changes.
    //       Press{' '}
    //       <ThemedText>
    //         {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
    //       </ThemedText>{' '}
    //       to open developer tools.
    //     </ThemedText>
    //   </View>
    //   <View style={styles.stepContainer}>
    //     <Button title="Se déconnecter" onPress={handleSignOut} />
    //   </View>
    //   <View>
    //     <Button title="Search" onPress={() => navigation.navigate('search')}/>
    //   </View>
    //   <View>
    //     <Button title="Dashboard" onPress={() => navigation.navigate('dashboard')}/>
    //   </View>
    //   </>
    <>
    <View style={styles.wrapperBanner}>
      <View style={styles.banner}>
        <Row style={{justifyContent: 'space-between', width: '90%'}}>
          <ThemedText color="#FFFF" style={{fontSize: 15, fontWeight: 800}}>{capitalizeFirstLetter(date.toLocaleString('default', { month: 'short' }))} {date.getDate()},  {date.getFullYear()}</ThemedText>
          <ThemedText style={[styles.circle]}>
            <Image source={require('@/assets/images/notification.png')} style={styles.image3} />
          </ThemedText>
        </Row>
        <View style={{flexDirection: 'row', gap: 20, justifyContent: 'flex-start', width: '90%'}}>
            <Image source={require('@/assets/images/profil/profil.webp')} style={styles.image2} />
            <View style={{flexDirection: 'column'}}>
              <Text style={{color: 'white', fontSize: 30, fontWeight: 800, letterSpacing: 2}}>Hello, {userData[0]?.name} !</Text>
              <View style={{flexDirection: 'row'}}>
                <Image source={require('@/assets/images/star.png')} style={styles.image3} />
                <ThemedText color="#FFFF">Free account</ThemedText>
              </View>
            </View>
        </View>
            {/* <ThemedText color={"white"}> Logo</ThemedText>
            <Image source={require('@/assets/images/profil/profil.webp')} style={styles.image2} /> */}
        </View>
      <Image source={require('@/assets/images/backgroundBlack.jpg')} style={styles.image}/>
    </View>
    <SafeAreaView style={styles.header}>
      {/* <Banner/> */}
        <Row gap={5} style={styles.rowTwoItems}>
          <NutritionalCard
          nutritionalName={'calories'}
          nutrionalData={basalMetabolicRate}
          icon={'burn'}
          backgroundcolor={colors.gray}
          indice={'g'}
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
          <Button title="Se déconnecter" onPress={handleSignOut} />
        </View>
        <View>
          <Button title="Search" onPress={() => navigation.navigate('search')}/>
        </View>
        <View>
          <Button title="Dashboard" onPress={() => navigation.navigate('dashboard')}/>
        </View>
        {isLoading ? (
        <View style={{flexDirection: 'column'}}>
          
          <ThemedText>Calories nedd:
            {basalMetabolicRate}
          </ThemedText>

          <ThemedText>Height {userData[0]?.height}</ThemedText>
          <ThemedText>Weight {userData[0]?.weight}</ThemedText>
          <ThemedText>gender {userData[0]?.gender}</ThemedText>
          <ThemedText>Activite {userData[0]?.activityLevel}</ThemedText>
          <ThemedText>Proteins need: {calculProteins(Number(userData[0]?.weight))}</ThemedText>
          <ThemedText>Carbohydrates need: {calculCarbohydrates(basalMetabolicRate)}</ThemedText>
          <ThemedText>Fats need: {calculFats(basalMetabolicRate)}</ThemedText>
          {/* <ThemedText>Age {userData[0]?.dateOfBirth}</ThemedText> */}
          <ThemedText>Age {calculAge(userData[0]?.dateOfBirth)}</ThemedText>
        </View>
        ) : (
          <View>
            <ThemedText>Is loading....</ThemedText>
          </View>
        )}
        {/* <Navbar/> */}

    </SafeAreaView>
    </>
    // </ParallaxScrollView>
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });


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
  wrapperBanner : {
    position: 'relative',
    height: 250,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  banner : {
    width: '100%',
    height: 250,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    borderRadius: 100
    
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  image2 : {
      width: 60,
      height: 60,
      borderRadius: 30
  },
  image3 : {
    width: 15,
    height: 15
  },
  image : {
    position: 'absolute',
    width: '100%',
    height: 250,
    objectFit: 'fill',
    zIndex: -1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  }
})
