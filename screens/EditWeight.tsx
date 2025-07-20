import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { fetchUserDataConnected } from '@/functions/function';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {

    const {colors} = useTheme();

    const { t} = useTranslation();

    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const [weight, setWeight] = useState(0);
    const [ isFocused, setIsFocused] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
  // Re-fetch les données utilisateur à chaque mise à jour
    // fetchUserDataConnected(user, setUserData);
    }, [refreshKey]);


const handleSave = async () => {
    if (!weight || isNaN(weight) || weight <= 0) {
        Alert.alert('Erreur', 'Veuillez entrer un poids valide.');
        return;
    }
    if (!user) {
        console.error('User not authenticated');
        return;
    }

    const db = getFirestore();
    const userDocRef = doc(db, 'User', user.uid);

    const date = new Date();
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const newEntry = {
        date: formattedDate,
        weight: Number(weight),
    };

    try {
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
        console.error('User document does not exist');
        return;
        }

        const userData = userSnapshot.data();
        const currentLog = userData.weightLog || [];

        const updatedLog = [...currentLog];
        const existingIndex = updatedLog.findIndex(entry => entry.date === formattedDate);

        if (existingIndex !== -1) {
            // remplace the enrty if it exists
            updatedLog[existingIndex] = newEntry;
        } else {
            // add a new entry if it doesn't exist
            updatedLog.push(newEntry);
        }

        await updateDoc(userDocRef, {
        weight: Number(weight),
        weightLog: updatedLog,
        });

        console.log('Poids et journal mis à jour avec succès');
        navigation.replace('home'); // Redirige vers l'écran d'accueil après la mise à jour
        // navigation.replace('Home');
        Alert.alert('Succès', 'Poids mis à jour avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        Alert.alert('Erreur', 'Impossible de mettre à jour le poids.');
    }
};


    return (
        <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>

            <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, {borderColor: isFocused ? colors.black : colors.grayDarkFix, color: colors.black, backgroundColor: colors.whiteMode}]}
                keyboardType='numeric'
                onChange={(text) => setWeight(text.nativeEvent.text)}
            />
            {/* {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null} */}
            </View>
        <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.black}]} onPress={handleSave}>
                <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>{t('save')}</Text>
            </TouchableOpacity>
        </View>

        {/* <Modal
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
        </Modal> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        height: 20,
        
    },
    // modalContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // },
    // modalContent: {
    //     width: '80%',
    //     backgroundColor: '#ffffff',
    //     borderRadius: 10,
    //     padding: 20,
    //     alignItems: 'center',
    // },
    // modalText: {
    //     marginBottom: 15,
    //     textAlign: 'center',
    //     fontSize: 16,
    //     color: '#333333',
    //     lineHeight: 25
    // },
    // modalButtons: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     width: '100%',
    // },
    // cancelButton: {
    //     flex: 1,
    //     marginRight: 5,
    //     backgroundColor: '#cccccc',
    //     padding: 10,
    //     borderRadius: 5,
    //     alignItems: 'center',
    // },
    // cancelButtonText: {
    //     color: '#333333',
    //     fontWeight: '600',
    // },
    // confirmButton: {
    //     flex: 1,
    //     marginLeft: 5,
    //     padding: 10,
    //     borderRadius: 5,
    //     alignItems: 'center',
    // },
    // confirmButtonText: {
    //     color: '#ffffff',
    //     fontWeight: '600',
    // },
});

export default EditProfileScreen;
