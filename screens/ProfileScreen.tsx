import { User } from '@/interface/User';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import {  firestore } from '@/firebaseConfig';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';

const ProfileScreen = () => {
  const [userData, setUserData] = useState<User[]>([])
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false)

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
      }
    }
    fetchUserData()
    setTimeout(() => {
      setIsLoading(true)

    }, 1500)
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
      {isLoading ? <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.profileImage} />  : <Skeleton colorMode={colorMode} height={120} width={120} radius={'round'}/> }
        {isLoading ? <Text style={styles.name}>{userData[0]?.firstName} {userData[0]?.name}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={150} /></View> }
        {isLoading ? <Text style={styles.email}>{userData[0]?.email}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250} /></View> }
      </View>
      {isLoading ? <Text>Test reusisi</Text> : <Text>Chargement</Text>}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal information</Text>
        {isLoading ? <Text style={styles.infoText}>Name: {userData[0]?.name}</Text> : <Skeleton colorMode={colorMode} width={250}/> }
        {isLoading ? <Text style={styles.infoText}>Firstname: {userData[0]?.firstName}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250} /></View> }
        {isLoading ? <Text style={styles.infoText}>Gender: {userData[0]?.gender}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
        {isLoading ? <Text style={styles.infoText}>Date of birth: {userData[0]?.dateOfBirth}</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Details</Text>
        {isLoading ? <Text style={styles.infoText}>Height: {userData[0]?.height} cm</Text> : <Skeleton colorMode={colorMode} width={250}/> }
        {isLoading ? <Text style={styles.infoText}>Weight: {userData[0]?.weight} kg</Text> : <View style={{marginTop: 5}}><Skeleton colorMode={colorMode} width={250}/></View> }
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        {isLoading ? <Text style={styles.infoText}>Activity level: {userData[0]?.activityLevel}</Text> : <Skeleton colorMode={colorMode} width={250}/> }
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Options</Text>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.optionText}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Dark mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Premium Subscription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate("ChangePassword")}>
          <Text style={styles.optionText}>Change password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  profileHeader: {
    alignItems: 'center',
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
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  optionButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#007BFF',
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
