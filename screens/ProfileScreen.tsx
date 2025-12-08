import { User } from '@/interface/User';
import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import {  firestore } from '@/firebaseConfig';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';
import { useTheme } from '@/hooks/ThemeProvider';
import { deleteByCollection, getIdAvatarProfile } from '@/functions/function';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, fetchUserData } from '@/redux/userSlice';
import { useTranslation } from 'react-i18next';
import '../locales/i18n';
import EditLink from '@/components/EditLink';
import Rive, { RiveRef } from 'rive-react-native';
import BMIBar from '@/components/BMIBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRiveRestore } from '@/hooks/useRiveSelections';
import { RootState, AppDispatch } from '@/redux/store';


const ProfileScreen = () => {

  const {colors} = useTheme();
  const { t, i18n } = useTranslation();

  const auth = getAuth();
  const user = auth.currentUser;

  const userRedux = useSelector((state: RootState) => state.user.user);

  const [userData, setUserData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch<AppDispatch>();
  const [ modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigation = useNavigation()
  const genderKey = userData[0]?.gender;

  /**RIVE SETUP*/
  const riveRef = useRef<RiveRef>(null);
  //@ts-ignore
  useRiveRestore(riveRef);
  const { restoreSelections } = useRiveRestore(riveRef);

useEffect(() => {
  const fetchUserFromFirestore = async () => {
    if (user !== null) {
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
        goalLogs: doc.data().goalLogs,
        goal: doc.data().goal,
      }));

      const sortByUniqueUserConnected = userList.filter((user) => user.email === email);
      setUserData(sortByUniqueUserConnected);
      setIsLoading(false);
    }
  };

  fetchUserFromFirestore();
}, []);

    
  useFocusEffect(
    React.useCallback(() => {
      if (user?.email) {
        dispatch(fetchUserData(user.email));
      }
    }, [user])
  );
  
  const avatar = getIdAvatarProfile(Number(userData[0]?.profilPicture))

  const handleSignOut = async () => {
    setErrorMessage('')
    try {
      // await setPersistence(auth, browserSessionPersistence);
      await signOut(auth); // Déconnexion de l'utilisateur
      dispatch(clearUser());
      navigation.reset({
        index: 0,
        routes: [{ name: 'auth' }],
      });
    } catch (error: unknown) {
      setErrorMessage(t('logoutError'))
    }
  };
  /** DELETE ACCOUNT */
  const [confirmationText, setConfirmationText] = useState('');

  const handleSave = () => {
    setModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    try {
      if(auth.currentUser) {
        const lastSignInTime = auth.currentUser.metadata.lastSignInTime;
        if (!lastSignInTime) {
          console.log("Last sign-in time is undefined.");
          return;
        }
        const currentTime = new Date().getTime();
        const sessionDuration = currentTime - new Date(lastSignInTime).getTime();
  
        // Si la session dure plus de 1 heure (3600000 ms), demandez à l'utilisateur de se déconnecter et de se reconnecter
        if (sessionDuration > 3600000) {
          Alert.alert(
            'Security Alert',
            'You have been logged in for too long. Please log out and log in again for security reasons.',
            [
              { text: 'OK' },
            ],
          );
          return;
        }

        deleteByCollection('UserMealsCreated',auth.currentUser.uid, 'userId')
        deleteByCollection('UserCreatedFoods',auth.currentUser.uid, 'idUser')
        deleteByCollection('UserMeals',auth.currentUser.uid, 'userId')

        const userDocRef = doc(firestore, "User", auth.currentUser.uid);
        await deleteDoc(userDocRef);
        console.log("User document deleted from Firestore");
    
        await deleteUser(auth.currentUser);
        console.log("User deleted from authentication");

        dispatch(clearUser());
        setModalVisible(false)
        
        handleSignOut()
      }else {
        console.log("No current user found");
      }
    } catch (error) {
      console.log("Error during the deletion of account", error);
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: colors.grayBg}]} persistentScrollbar={true}>
        <View style={[styles.containerTranslate, { backgroundColor: colors.white}]}>
          <View style={{width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <View></View>
          </View>
          <View style={{marginLeft: 10, backgroundColor: colors.gray, gap: 3, display: 'flex', alignItems: 'center', padding: 4, borderRadius: 5, justifyContent: "space-between", flexDirection: 'row', width: '40%'}}>
            <Image source={require('@/assets/images/traduction.png')} style={{width: 30, height: 30}}/>
            <TouchableOpacity  onPress={() => changeLanguage('en')} style={[styles.langButton, i18n.language === "en" && styles.isActive ]}>
              <Text >EN</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => changeLanguage('fr')} style={[styles.langButton, i18n.language === "fr" && styles.isActive]}>
              <Text>FR</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => changeLanguage('es')} style={[styles.langButton, i18n.language === "es" && styles.isActive]}>
              <Text>ES</Text>
            </TouchableOpacity >
          </View>
        </View>
      <View style={styles.profileHeader}>
      {/* <Skeleton colorMode={colorMode} width={120} height={120} radius={'round'}>
      {!isLoading ? <Image source={avatar} style={styles.profileImage} />  : null }
      </Skeleton> */}
      <View style={{backgroundColor: colors.white, borderRadius: "50%",overflow: 'hidden', justifyContent: 'center', alignItems: 'center', height: 150, width: 150, marginTop: -8}}>
          <Rive
              ref={riveRef}
              // source={require("../assets/rive/panda_neutral (25).riv")}
              source={require("../assets/rive/panda_neutral (25).riv")}
              autoplay={true}
              onStateChanged={() => {
                restoreSelections();
              }}
              style={{ width: 200, height: 200, marginTop: 50 }}
          />
      </View>
                {/* <Rive
              ref={riveRef}
              source={require("../assets/rive/panda_neutral (22).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 50 }}
          /> */}
          {/* <Rive
              ref={riveRef}
              source={require("../assets/rive/panda_neutral (19).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 50 }}
          /> */}

{/* TEST DIFFERENT SIZE PANDA  */}
        {/* <View style={{backgroundColor: colors.white, borderRadius: "50%",overflow: 'hidden', justifyContent: 'center', alignItems: 'center', height: 150, width: 150, marginTop: -8}}>
          <Rive
              source={require("../assets/rive/panda_neutral (8).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 70 }}
          />
      </View>
              <View style={{backgroundColor: colors.white, borderRadius: "50%",overflow: 'hidden', justifyContent: 'center', alignItems: 'center', height: 150, width: 150, marginTop: -8}}>
          <Rive
              source={require("../assets/rive/panda_neutral.riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 70 }}
          />
      </View>
        <View style={{backgroundColor: colors.white, borderRadius: "50%",overflow: 'hidden', justifyContent: 'center', alignItems: 'center', height: 150, width: 150, marginTop: -8}}>
          <Rive
              source={require("../assets/rive/panda_neutral (7).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 70 }}
          />
      </View>
          <Rive
              source={require("../assets/rive/panda_neutral (9).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 70 }}
          />          <Rive
              source={require("../assets/rive/panda_neutral (10).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 70 }}
          />    <Rive
              source={require("../assets/rive/panda_neutral (11).riv")}
              autoplay={true}
              style={{ width: 200, height: 200, marginTop: 70 }}
          /> */}
      {/* {isLoading ? <Image source={{ uri: `data:image/jpeg;base64,${userData[0]?.profilPicture}` }} style={styles.profileImage} />  : <Skeleton colorMode={colorMode} height={120} width={120} radius={'round'}/> } */}
        {/* {!isLoading ? <Text style={[styles.name, { color: colors.black}]}>{userData[0]?.name} {userData[0]?.firstName}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {!isLoading ? <Text style={[styles.email, { color: colors.black}]}>{userData[0]?.email}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250} /></View> } */}
      </View>
        <EditLink
          label="Avatar"
          iconSource={require('@/assets/images/icon/goal.png')}
          navigateTo="Avatar"
        />
        <BMIBar weight={70} height={180}/>
      {/* <View style={{ flexDirection: 'row',  marginBottom: 20}}>
        <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 5, borderBottomColor: "black"}}>
        <Text style={{}} >Profile</Text>
          
        </View>
        <View style={{width: '50%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 5, borderBottomColor: "black"}}>
        <Text>Achievments</Text>

        </View>
      </View> */}
      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('personal_information')}</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('firstName')}: {userData[0]?.name}</Text> : <Skeleton colorMode={colorMode} width={100}/> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('lastName')}: {userData[0]?.firstName}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('gender')}: {t(`gender_${genderKey}`)}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={200}/></View> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('dateOfBirth')}: {userData[0]?.dateOfBirth}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
        
        {!isLoading ? <Text style={[styles.email, { color: colors.black}]}>{t('email')} : {userData[0]?.email}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250} /></View> }
        </View>
      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('healthDetails')}</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('height')}: {userData[0]?.height} cm</Text> : <Skeleton colorMode={colorMode} width={200}/> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('weight')}: {userData[0]?.weight} kg</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>

    <View style={[styles.section, {backgroundColor: colors.white}]}>
      <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('activity')}</Text>

      {!isLoading ? (
        <>
          <Text style={[styles.infoText, {color: colors.black}]}>
            {t('activityLevel')}: {t(userRedux?.activityLevel || 'unknown')}
          </Text>

          <Text style={[styles.infoText, {color: colors.black}]}>
            {t('goal')}: {t(userRedux?.goal || 'unknown')}
          </Text>

          {['calories', 'proteins', 'carbs', 'fats'].map((key) => {
            const value = userRedux?.goalLogs?.[key];
            if (!value) return null;

            let displayValue = value;

            if (key === 'calories') {
              const sign =
                userRedux?.goal === 'gain'
                  ? '+ '
                  : userRedux?.goal === 'lose'
                  ? '- '
                  : '';
              displayValue = `${sign}${value}`;
            } else {
              displayValue = `+ ${value}`;
            }

            return (
              <Text key={key} style={[styles.infoText, { color: colors.black }]}>
                {t(key)}: {displayValue}
              </Text>
            );
          })}
        </>
      ) : (
        <>
          <Skeleton colorMode={colorMode} width={250} />
          <Skeleton colorMode={colorMode} width={250} />
          <Skeleton colorMode={colorMode} width={250} />
          <Skeleton colorMode={colorMode} width={250} />
          <Skeleton colorMode={colorMode} width={250} />
          <Skeleton colorMode={colorMode} width={250} />
        </>
      )}
    </View>

      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('goal')}</Text>
        <EditLink
          label={t('editGoal')}
          iconSource={require('@/assets/images/icon/goal.png')}
          navigateTo="Editgoal"
        />
        <EditLink
          label={t('editWeight')}
          iconSource={require('@/assets/images/icon/weight.png')}
          navigateTo="Editweight"
        />
        <EditLink
          label={t('history_weight')}
          iconSource={require('@/assets/images/icon/history.png')}
          navigateTo="historyweight"
          isLast
          pro
        />
      </View>

      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('Options')}</Text>

        {/* <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditProfile')}>
          <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center', gap: 15}}>
            <Image source={require('@/assets/images/icon/settings.png')} style={{width: 20, height: 20, tintColor: colors.black}} />
          <Text style={[styles.optionText, {color : colors.black}]}>{t('editProfile')}</Text>
          </View>
          <View>
            <Image source={require('@/assets/images/arrow-right.png')} style={{width: 15, height: 15, tintColor: colors.black}}/>
          </View>
        </TouchableOpacity> */}
        <EditLink
          label={t('editProfile')}
          iconSource={require('@/assets/images/icon/settings.png')}
          navigateTo="EditProfile"
        />
        <EditLink
          label={t('changePassword')}
          iconSource={require('@/assets/images/icon/switch.png')}
          navigateTo="ChangePassword"
        />
        <EditLink
          label={t('termsOfUse')}
          iconSource={require('@/assets/images/icon/terms.png')}
          navigateTo="Terms"
        />
        <EditLink
          label={t('privacyPolicy')}
          iconSource={require('@/assets/images/icon/privacy.png')}
          navigateTo="Policy"
        />
        <EditLink
          label={t('faq')}
          iconSource={require('@/assets/images/icon/faq.png')}
          navigateTo="faq"
        />
        <EditLink
          label={t('contactSupport')}
          iconSource={require('@/assets/images/icon/email.png')}
          navigateTo="Report"
        />
        <EditLink
          label={t('logout')}
          iconSource={require('@/assets/images/icon/logout.png')}
          onPress={handleSignOut}
          isLast 
        />
        {errorMessage && <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text>}
        {/* <TouchableOpacity style={styles.optionButton}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Premium Subscription</Text>
          </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.optionButton} onPress={handleSignOut}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('logout')}</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleSave}>
          <Text style={styles.deleteText}>{t('deleteAccount')}</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
        >
          <View style={modal.modalContainer}>
            <View style={modal.modalContent}>
              <Text style={modal.modalText}>
                {t('textDelete')}
              </Text>

              {/* Input Field for Confirmation */}
              <TextInput
                style={modal.textInput}
                placeholder={t('placeholderDelete')}
                value={confirmationText}
                onChangeText={setConfirmationText}
                autoCapitalize="none"
              />

              <View style={modal.modalButtons}>
                <TouchableOpacity style={modal.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={modal.cancelButtonText}>{t('cancel')}</Text>
                </TouchableOpacity>

                {/* Disable the confirm button until the correct text is entered */}
                <TouchableOpacity
                  style={[
                    modal.confirmButton,
                    {
                      backgroundColor:
                        confirmationText === "DELETE" ? colors.primary : "#ccc",
                    },
                  ]}
                  onPress={handleDeleteAccount}
                  disabled={confirmationText !== "DELETE"} // Disable button if text doesn't match
                >
                  <Text style={modal.confirmButtonText}>{t('confirm')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  containerTranslate: {
    backgroundColor: "white",
    borderRadius: 8,
    display: "flex",
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%', 
    flexDirection: "row",
    padding: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 0,
    paddingTop: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  optionButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  // optionButton: {
  //   paddingVertical: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ddd',
  // },
  optionText: {
        fontSize: 15,
        fontWeight: '400',
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#FF4D4D',
  },
  langButton: {
  borderRadius: 4,
  padding: 5,
},
  isActive: {
    backgroundColor: "white",
    borderRadius: 4,
  }
});

const modal = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#333333',
    lineHeight: 25
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
})