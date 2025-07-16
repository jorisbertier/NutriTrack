import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import { getAuth, signOut } from 'firebase/auth';
import { fetchUserDataConnected } from '@/functions/function';
import { User } from '@/interface/User';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
// import { Auth } from '@/firebaseConfig';
import { useTheme } from '@/hooks/ThemeProvider';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/userSlice';
import { useTranslation } from 'react-i18next';

const EditProfileScreen = ({ navigation, updateUserInfo }) => {

  const {colors} = useTheme();

  const { t} = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchUserDataConnected(user, setUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      setFormData((prev) => ({
        ...prev,
        name: userData[0]?.name || '',
        firstName: userData[0]?.firstName || '',
        height: String(userData[0]?.height || ''),
        weight: String(userData[0]?.weight || ''),
        activityLevel: userData[0]?.activityLevel || '',
      }));
    }
  }, [userData]);

  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    height: '',
    weight: '',
    activityLevel: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    firstName: '',
    height: '',
    weight: '',
  });

  const handleSave = () => {
    setModalVisible(true);
  };

  const handleSignOut = async () => {
    try {
      // await setPersistence(auth, browserSessionPersistence);
      dispatch(clearUser());
      await signOut(auth); // Déconnexion de l'utilisateur
      navigation.reset({
        index: 0,
        routes: [{ name: 'auth' }],
      });
    } catch (error: unknown) {
      Alert.alert('Erreur de déconnexion', error.message);
    }
  };

  const updateUserData = async (userId, updatedData) => {
    const db = getFirestore();
    const userDoc = doc(db, 'User', userId);

    try {
      await updateDoc(userDoc, updatedData);
      console.log("User data updated successfully!", updatedData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const confirmSave = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      await updateUserData(user.uid, {
        name: formData.name,
        firstName: formData.firstName,
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: formData.activityLevel,
      });
      updateUserInfo && updateUserInfo(formData);
      handleSignOut();
      navigation.navigate('auth');
    } catch (error) {
      console.error('Error updating user info:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const keysOrder = ['name', 'firstName', 'height', 'weight'];

  const validateInput = (key, value) => {
    let isValid = true;
    let errorMessage = '';

    if (value === '') {
      setErrors((prev) => ({ ...prev, [key]: '' }));
      setFormData((prev) => ({ ...prev, [key]: value }));
      return;
    }

    if (key === 'name' || key === 'firstName') {
      const regex = /^[A-Za-zÀ-ÿ]+$/;
      if (!regex.test(value)) {
        isValid = false;
        errorMessage = 'This field must contain only letters.';
      }
    } else if (key === 'weight' || key === 'height') {
      const regex = /^[0-9]+$/;
      if (!regex.test(value)) {
        isValid = false;
        errorMessage = 'This field must contain only numbers.';
      }
    }

    if (isValid) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
      setFormData((prev) => ({ ...prev, [key]: value }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: errorMessage }));
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>

      {keysOrder.map((key) => (
        <View key={key} style={styles.inputContainer}>
          <TextInput
            style={[styles.input, {backgroundColor: colors.grayPress}]}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key]}
            onChangeText={(text) => validateInput(key, text)}
          />
          {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
        </View>
      ))}

      <Text style={[styles.label, {color : colors.black}]}>{t('activityLevel')}</Text>
      <Picker
        selectedValue={formData.activityLevel}
        style={[styles.picker, { backgroundColor: colors.grayPress}]}
        onValueChange={(itemValue) =>
          setFormData((prev) => ({ ...prev, activityLevel: itemValue }))
        }
      >
        <Picker.Item label={t('sedentary')} value="sedentary" />
        <Picker.Item label={t("lowactive")} value="lowactive" />
        <Picker.Item label={t("moderate")} value="moderate" />
        <Picker.Item label={t("active")} value="active" />
        <Picker.Item label={t("superactive")} value="superactive" />
      </Picker>

      <TouchableOpacity style={[styles.saveButton,{backgroundColor: colors.primary}]} onPress={handleSave}>
        <Text style={[styles.saveButtonText]}>{t('save')}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t('saveText')}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, {backgroundColor: colors.primary}]} onPress={confirmSave}>
                <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    height: 20,
    
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

export default EditProfileScreen;
