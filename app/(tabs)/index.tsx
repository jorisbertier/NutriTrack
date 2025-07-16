import { StyleSheet, Alert, ScrollView, StatusBar, Text, ImageSourcePropType, View, Modal, Button, TouchableOpacity, Linking, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { firestore } from '@/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { User } from '@/interface/User';
import Row from '@/components/Row';
import NutritionalCard from '@/components/NutritionCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculAge, BasalMetabolicRate, calculProteins, calculFats } from '@/functions/function';
import { calculCarbohydrates } from '../../functions/function';
import Banner from '@/components/Banner';
import Challenge from '@/components/Challenge';
import StopWatch from '@/components/StopWatch';
import { useTheme } from '@/hooks/ThemeProvider';
import { BackHandler } from 'react-native';
import { Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {

  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute(); 
  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user !== null) {
        // The user object has basic properties su
        const email = user.email;

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
// EAS.json pour builder sur la app
// {
//   "cli": {
//     "version": ">= 13.1.1",
//     "appVersionSource": "remote"
//   },
//   "build": {
//     "preview": {
//       "android": {
//         "buildType": "apk"
//       }
//     },
//     "preview2": {
//       "android": {
//         "gradleCommand": ":app:assembleRelease"
//       }
//     },
//     "preview3": {
//       "developmentClient": true
//     },
//     "preview4": {
//       "distribution": "internal"
//     },
//     "production": {
//       "android": {
//         "buildType": "apk"
//       }
//     }
//   }
// }
useEffect(() => {
  const backAction = () => {
    if (user && route.name === 'Home') {
      Alert.alert('Exit the application!', 'Are you sure you want to exit the application?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    }
    navigation.goBack();
    return true;
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  // Nettoyage de l'écouteur à la fermeture du composant
    return () => backHandler.remove();
  }, [route, user]);

  interface Challenge {
    name: string;
    source: any;
  }
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const handleStopWatch = (name: string, source: ImageSourcePropType) => {
    setSelectedChallenge({name, source})
  }

  useEffect(() => {
    if (selectedChallenge) {
      console.log('Challenge sélectionné :', selectedChallenge);
    }
  }, [selectedChallenge]);

  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    const checkWelcomeMessage = async () => {

      if (!userData || !userData[0]?.email) {
        return;
      }

      const currentUserEmail = userData[0]?.email
      const hasSeenWelcomeKey = `hasSeenWelcomeMessage_${currentUserEmail}`;
      const hasSeenWelcomeMessage = await AsyncStorage.getItem(hasSeenWelcomeKey);
      
      if (!hasSeenWelcomeMessage) {
        setModalVisible(true);
        await AsyncStorage.setItem(hasSeenWelcomeKey, 'true');
      }
    };

    checkWelcomeMessage();
  }, [userData]);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handlePress = async () => {
    const url = 'https://buy.stripe.com/test_fZe5n70Ai4oZabK9AA';
  
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Impossible d'ouvrir l'URL : ", url);
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture de l'URL :", error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Banner name={userData[0]?.name} isLoading={isLoading} profilePictureId={Number(userData[0]?.profilPicture)}/>
      <SafeAreaView style={[styles.header, {backgroundColor: colors.white}]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Row style={{marginTop: 40}}>
            <ThemedText variant='title' color={colors.black}>Nutri track</ThemedText>
          </Row>
          <Row style={{marginTop: 20}} >
          <Pressable onPress={() => navigation.navigate('dashboard')} style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            borderRadius: 4,
            elevation: 3,
            backgroundColor: colors.blackFix,
            width: '100%'
          }}>
            <Text style={{fontSize: 16,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: colors.whiteFix,}}>Dashboard</Text>
          </Pressable>
          </Row>
          <Row style={{marginTop: 20, marginBottom: -15}}>
            <ThemedText variant='title' color={colors.black}>Nutri metrics</ThemedText>
          </Row>
            <Row gap={5} style={styles.rowTwoItems}>
              <NutritionalCard
                nutritionalName={'calories'}
                nutrionalData={basalMetabolicRate}
                icon={'burn'}
                backgroundcolor={colors.gray}
                indice={'kcal'}
                setState={isLoading}
              />
              <NutritionalCard
                nutritionalName={'proteins'}
                nutrionalData={calculProteins(Number(userData[0]?.weight))}
                backgroundcolor={colors.greenLight}
                indice={'g'}
                icon={'protein'}
                setState={isLoading}
              />
              <NutritionalCard
                nutritionalName={'carbs'}
                nutrionalData={calculCarbohydrates(basalMetabolicRate)}
                backgroundcolor={colors.blue}
                indice={'g'}
                icon={'carbs'}
                setState={isLoading}
              />
              <NutritionalCard
                nutritionalName={'fats'}
                nutrionalData={calculFats(basalMetabolicRate)}
                backgroundcolor={colors.blueLight}
                indice={'g'}
                icon={'fat'}
                setState={isLoading}
              />
            </Row>
            <Row style={{marginTop: 15, marginBottom: 10}}>
              <ThemedText variant='title' color={colors.black}>Nutri challenge</ThemedText>
            </Row>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                <Challenge name={'sugar'}source={require('@/assets/images/challenge/sugar.jpg')}
                    onPress={() => handleStopWatch('sugar', require('@/assets/images/challenge/sugar.jpg'))} 
                />
                {/* <Challenge name={'cigarette'} source={require('@/assets/images/challenge/cigarette.jpg')}
                    onPress={() => handleStopWatch('cigarette', require('@/assets/images/challenge/cigarette.jpg'))} 
                />
                <Challenge name={'fast food'} source={require('@/assets/images/challenge/fastfood.jpg')}
                    onPress={() => handleStopWatch('fast food', require('@/assets/images/challenge/fastfood.jpg'))} 
                />
                <Challenge name={'chocolate'} source={require('@/assets/images/challenge/chocolate.jpg')}
                    onPress={() => handleStopWatch('chocolate', require('@/assets/images/challenge/chocolate.jpg'))} 
                /> */}
            </ScrollView>
            <View>
              <Modal transparent={true} visible={modalVisible} animationType="slide">
                <View style={modal.modalContainer}>
                  <View style={modal.modalContent}>
                    <Text style={modal.modalText}>
                      Welcome to Nutri Track! 🎉{'\n'}{'\n'}
                      Nutri Track helps you track your nutrition and achieve your health goals. 🥗{'\n'}{'\n'}
                      You can earn 20XP per day by completing your daily objectives! 🚀{'\n'}{'\n'}
                      Start tracking now to improve your nutrition and earn exciting levels ⚡!
                    </Text>
                    <Button title="Got it!" color={colors.primary} onPress={handleClose} accessibilityLabel="Close the presentation modal"/>
                  </View>
                </View>
              </Modal>
            </View>
            <StopWatch selectedChallenge ={selectedChallenge} email={userData[0]?.email}/>
          </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingBottom: 8,
    flex: 1,
    marginTop: -35
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
    marginTop: 30
  },
  scrollView: {
    padding: 0,
    paddingVertical: 10
  },
})

const modal = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
