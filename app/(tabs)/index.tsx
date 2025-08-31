import { StyleSheet, Alert, ScrollView, StatusBar, Text, ImageSourcePropType, View, Modal, TouchableOpacity, Image } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import PremiumOverlayWrapper from '@/components/Premium';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
    // "googleMobileAds": {
    //   "androidAppId": "ca-app-pub-3940256099942544~3347511713",
    //   "iosAppId": "ca-app-pub-3940256099942544~1458002511"
    // },

export default function HomeScreen() {

  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute(); 
  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [soon, setSoon]= useState(true);

  const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user !== null) {
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
        setUserData(sortByUniqueUserConnected);
        setIsLoading(true);
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

  useEffect(() => {
    const backAction = () => {
      if (user && route.name === 'Home') {
        Alert.alert(t('exitApp'), t('exitAppText'), [
          {
            text: t('cancel'),
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: t('yes').toUpperCase(),
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


  return (
    <>
      <StatusBar barStyle="light-content" />
      <Banner name={userData[0]?.name} isLoading={isLoading} profilePictureId={Number(userData[0]?.profilPicture)} isPremium={isPremium}/>
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
            borderRadius: 20,
            elevation: 3,
            backgroundColor: colors.black,
            width: '100%'
          }}>
            <Text style={{fontSize: 16,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: colors.white,}}>{t('dashboard')}</Text>
          </Pressable>
          </Row>
          <Row style={{marginTop: 20, marginBottom: -15}}>
            <ThemedText variant='title' color={colors.black}>Nutri metrics</ThemedText>
          </Row>
            <Row gap={5} style={styles.rowTwoItems}>
              <NutritionalCard
                nutritionalName={t('calories')}
                nutrionalData={basalMetabolicRate}
                icon={'burn'}
                backgroundcolor={colors.gray}
                indice={'kcal'}
                setState={isLoading}
              />
              <NutritionalCard
                nutritionalName={`${t('proteins')}`}
                nutrionalData={calculProteins(Number(userData[0]?.weight))}
                backgroundcolor={colors.greenLight}
                indice={'g'}
                icon={'protein'}
                setState={isLoading}
              />
              <NutritionalCard
                nutritionalName={t('carbs')}
                nutrionalData={calculCarbohydrates(basalMetabolicRate)}
                backgroundcolor={colors.blue}
                indice={'g'}
                icon={'carbs'}
                setState={isLoading}
              />
              <NutritionalCard
                nutritionalName={t('fats')}
                nutrionalData={calculFats(basalMetabolicRate)}
                backgroundcolor={colors.blueLight}
                indice={'g'}
                icon={'fat'}
                setState={isLoading}
              />
            </Row>
            <Row>
          <View>

            {/* ✅ Bannière */}
            {/* <AdMobBanner
              bannerSize="fullBanner"
              adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID officiel Google
              servePersonalizedAds // true = pubs personnalisées
              onDidFailToReceiveAdWithError={(err) => console.log(err)}
            /> */}
          </View>
            </Row>
            <Row style={{marginTop: 15, marginBottom: 10}}>
              <ThemedText variant='title' color={colors.black}>Nutri challenge</ThemedText>
            </Row>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                <Challenge name={t('noSugar')} source={require('@/assets/images/challenge/sugar.jpg')}
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
            <Modal transparent={true} visible={modalVisible} animationType="fade">
              <View style={modal.backdrop}>
                <View style={[modal.modalContainer, { backgroundColor: colors.gray}]}>
                  <Image source={require('@/assets/images/logo/logo2.png')} style={[modal.image]} />
                  <Text style={modal.title}>{t('modalTitle')} 🎉</Text>
                  <Text style={modal.text}>{t('modalText')} 🥗</Text>
                  <Text style={modal.text}>{t('modalText2')} 🚀</Text>
                  <Text style={modal.text}>{t('modalText3')} ⚡</Text>

                  <TouchableOpacity style={[modal.button, { backgroundColor: colors.blueLight}]} onPress={handleClose} accessibilityLabel="Close the presentation modal">
                    <Text style={[modal.buttonText, { color: colors.black}]}>{t('modalButton')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            </View>
            <PremiumOverlayWrapper showOverlay={soon}>
            <StopWatch
              selectedChallenge={selectedChallenge}
              email={userData[0]?.email}
            />
          </PremiumOverlayWrapper>

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

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
    width: '100%'
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  button: {
    marginTop: 25,
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation : 2
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
