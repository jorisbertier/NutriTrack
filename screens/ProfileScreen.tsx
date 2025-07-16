import { User } from '@/interface/User';
import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithPopup, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import {  firestore } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';
import { useTheme } from '@/hooks/ThemeProvider';
import { deleteByCollection, getIdAvatarProfile } from '@/functions/function';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import { useTranslation } from 'react-i18next';
import '../locales/i18n';


const ProfileScreen = () => {

  const {colors} = useTheme();
  const { t, i18n } = useTranslation();

  const auth = getAuth();
  const user = auth.currentUser;

  
  const [userData, setUserData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const [ modalVisible, setModalVisible] = useState(false)
  
  const navigation = useNavigation()
  const genderKey = userData[0]?.gender;

  useEffect(() => {
    const fetchUserData = async () => {
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
        }));

        const sortByUniqueUserConnected = userList.filter((user) => user.email === email);
        setUserData(sortByUniqueUserConnected)
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [])

  const avatar = getIdAvatarProfile(Number(userData[0]?.profilPicture))

  const handleSignOut = async () => {
    try {
      // await setPersistence(auth, browserSessionPersistence);
      await signOut(auth); // Déconnexion de l'utilisateur
      dispatch(clearUser());
      navigation.reset({
        index: 0,
        routes: [{ name: 'auth' }],
      });
    } catch (error: unknown) {
      Alert.alert('Erreur de déconnexion', error.message);
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
        // const lastSignInTime = auth.currentUser.metadata.lastSignInTime;
        // if (!lastSignInTime) {
        //   console.log("Last sign-in time is undefined.");
        //   return;
        // }
        // const currentTime = new Date().getTime();
        // const sessionDuration = currentTime - new Date(lastSignInTime).getTime();
  
        // // Si la session dure plus de 1 heure (3600000 ms), demandez à l'utilisateur de se déconnecter et de se reconnecter
        // if (sessionDuration > 3600000) {
        //   Alert.alert(
        //     'Security Alert',
        //     'You have been logged in for too long. Please log out and log in again for security reasons.',
        //     [
        //       { text: 'OK' },
        //     ],
        //   );
        //   return;
        // }

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
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: colors.whiteMode}]} persistentScrollbar={true}>
      
      
      <Button title="FR" onPress={() => changeLanguage('fr')} />
      <Button title="EN" onPress={() => changeLanguage('en')} />
      <Button title="ES" onPress={() => changeLanguage('es')} />
      <View style={styles.profileHeader}>
      <Skeleton colorMode={colorMode} width={120} height={120} radius={'round'}>
      {!isLoading ? <Image source={avatar} style={styles.profileImage} />  : null }
      </Skeleton>
      {/* {isLoading ? <Image source={{ uri: `data:image/jpeg;base64,${userData[0]?.profilPicture}` }} style={styles.profileImage} />  : <Skeleton colorMode={colorMode} height={120} width={120} radius={'round'}/> } */}
        {!isLoading ? <Text style={[styles.name, { color: colors.black}]}>{userData[0]?.name} {userData[0]?.firstName}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {!isLoading ? <Text style={[styles.email, { color: colors.black}]}>{userData[0]?.email}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250} /></View> }
      </View>
      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('personal_information')}</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('firstName')}: {userData[0]?.name}</Text> : <Skeleton colorMode={colorMode} width={100}/> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('lastName')}: {userData[0]?.firstName}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('gender')}: {t(`gender_${genderKey}`)}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={200}/></View> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('dateOfBirth')}: {userData[0]?.dateOfBirth}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>
      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('healthDetails')}</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('height')}: {userData[0]?.height} cm</Text> : <Skeleton colorMode={colorMode} width={200}/> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('weight')}: {userData[0]?.weight} kg</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>

      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('activity')}</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>{t('activityLevel')}: {userData[0]?.activityLevel}</Text> : <Skeleton colorMode={colorMode} width={250}/> }
      </View>

      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>{t('Options')}</Text>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('editProfile')}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.optionButton}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Premium Subscription</Text>
          </TouchableOpacity> */}
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate("ChangePassword")}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('changePassword')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Terms')}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('termsOfUse')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Policy')}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('privacyPolicy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate("Report")}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('contactSupport')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleSignOut}>
          <Text style={[styles.optionText, {color : colors.primary}]}>{t('logout')}</Text>
        </TouchableOpacity>
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
                Your account is about to be deleted. You will lose all data related to it!{"\n"}
                This requires a logout!{"\n"}
                To confirm, please corfim with **DELETE** below:
              </Text>

              {/* Input Field for Confirmation */}
              <TextInput
                style={modal.textInput}
                placeholder="Type DELETE to confirm"
                value={confirmationText}
                onChangeText={setConfirmationText}
                autoCapitalize="none"
              />

              <View style={modal.modalButtons}>
                <TouchableOpacity style={modal.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={modal.cancelButtonText}>Cancel</Text>
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
                  <Text style={modal.confirmButtonText}>Confirm</Text>
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
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600'
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