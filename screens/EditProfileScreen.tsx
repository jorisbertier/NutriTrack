import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchUserDataConnected } from '@/functions/function';
import { User } from '@/interface/User';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {

  const {colors} = useTheme();
  const navigation = useNavigation();

  const { t} = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: true }));
    };

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
      // updateUserInfo && updateUserInfo(formData);
      // updateUserInfo(formData);
       navigation.replace('home');
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
          <Text style={[styles.label, {color : colors.black}]}>{t(key)}</Text>
          <TextInput
            style={[styles.input, {backgroundColor: colors.white, borderColor: focusedFields[key] ? colors.black : colors.grayDarkFix}]}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key]}
            onChangeText={(text) => validateInput(key, text)}
            onFocus={() => handleFocus(key)}
            onBlur={() => setFocusedFields((prev) => ({ ...prev, [key]: false }))}
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

      <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
        <TouchableOpacity style={[styles.button,{backgroundColor: colors.black}]} onPress={handleSave}>
          <Text style={[styles.buttonText, { color : colors.white}]}>{t('save')}</Text>
        </TouchableOpacity>
      </View>

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
              <TouchableOpacity style={[styles.confirmButton, {backgroundColor: colors.black}]} onPress={confirmSave}>
                <Text style={[styles.confirmButtonText, { color: colors.white}]}>{t('confirm')}</Text>
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
  button: {
    height: 50,
    width: '90%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
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
    fontWeight: '600',
  },
});

export default EditProfileScreen;