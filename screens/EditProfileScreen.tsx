import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '@/components/context/UserContext';

const EditProfileScreen = ({ navigation }) => {
  const { userData, updateUserInfo } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
  });
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  useEffect(() => {
    // Vérifiez si userData est disponible
    if (userData) {
      console.log('User Data:', userData); // Ajoutez un log pour vérifier les données
      const { id, ...rest } = userData; // Exclure l'ID
      setFormData(rest); // Remplir le formulaire avec les données utilisateur
      setLoading(false); // Fin du chargement
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      await updateUserInfo(formData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const keysOrder = ['name', 'firstName', 'dateOfBirth', 'gender', 'height', 'weight', 'activityLevel'];

  if (loading) {
    // Affiche un indicateur de chargement tant que les données sont chargées
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      {keysOrder.map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={formData[key]}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, [key]: text }))}
        />
      ))}
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default EditProfileScreen;
