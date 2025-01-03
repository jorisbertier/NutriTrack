import { User } from '@/interface/User';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import {  firestore } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';
import { useTheme } from '@/hooks/ThemeProvider';
import { getIdAvatarProfile } from '@/functions/function';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/userSlice';

const ProfileScreen = () => {

  const {colors} = useTheme();

  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const [ modalVisible, setModalVisible] = useState(false)

  const navigation = useNavigation()

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
    } catch (error) {
      Alert.alert('Erreur de déconnexion', error.message);
    }
  };
/** DELETE ACCOUNT */
  const handleSave = () => {
    setModalVisible(true);
  };

  const handleDeleteAccount = () => {
    console.log('compte supprimé')
  }


  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: colors.whiteMode}]} persistentScrollbar={true}>
      <View style={styles.profileHeader}>
      <Skeleton colorMode={colorMode} width={120} height={120} radius={'round'}>
      {!isLoading ? <Image source={avatar} style={styles.profileImage} />  : null }
      </Skeleton>
      {/* {isLoading ? <Image source={{ uri: `data:image/jpeg;base64,${userData[0]?.profilPicture}` }} style={styles.profileImage} />  : <Skeleton colorMode={colorMode} height={120} width={120} radius={'round'}/> } */}
        {!isLoading ? <Text style={[styles.name, { color: colors.black}]}>{userData[0]?.firstName} {userData[0]?.name}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {!isLoading ? <Text style={[styles.email, { color: colors.black}]}>{userData[0]?.email}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250} /></View> }
      </View>
      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>Personal information</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Firstname: {userData[0]?.name}</Text> : <Skeleton colorMode={colorMode} width={100}/> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Lastname: {userData[0]?.firstName}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Gender: {userData[0]?.gender}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={200}/></View> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Date of birth: {userData[0]?.dateOfBirth}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>
      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>Health Details</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Height: {userData[0]?.height} cm</Text> : <Skeleton colorMode={colorMode} width={200}/> }
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Weight: {userData[0]?.weight} kg</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>

      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>Activity</Text>
        {!isLoading ? <Text style={[styles.infoText, {color: colors.black}]}>Activity level: {userData[0]?.activityLevel}</Text> : <Skeleton colorMode={colorMode} width={250}/> }
      </View>

      <View style={[styles.section, {backgroundColor: colors.white}]}>
        <Text style={[styles.sectionTitle, {color: colors.black}]}>Options</Text>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Edit profile</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.optionButton}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Premium Subscription</Text>
          </TouchableOpacity> */}
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate("ChangePassword")}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Change password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Terms')}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Terms of use</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Policy')}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Privacy policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate("Report")}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleSignOut}>
          <Text style={[styles.optionText, {color : colors.primary}]}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleSave}>
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
            Your account is about to be deleted, you will lose all data related to it !{"\n"} To confirm, please type **DELETE** below: ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, {backgroundColor: colors.primary}]} onPress={handleDeleteAccount}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
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
});
