import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import WeightPicker from '@/components/WeightPicker';
import { fetchUserDataConnected } from '@/functions/function';
import { User } from '@/interface/User';

const EditProfileScreen = () => {

    const {colors} = useTheme();

    const { t} = useTranslation();

    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const [weight, setWeight] = useState(80);
    const [userData, setUserData] = useState<User[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const [ isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await fetchUserDataConnected(user, setUserData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
    // Re-fetch datas users when to each update
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
        navigation.replace('home');
        Alert.alert('Succès', 'Poids mis à jour avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        Alert.alert('Erreur', 'Impossible de mettre à jour le poids.');
    }
};

    return (
        <View style={[styles.container, {backgroundColor: colors.whiteMode}]}>

            <Text style={[styles.title, {color : colors.black}]}>{t('textEditWeight')}</Text>
            <WeightPicker selectedWeight={weight} onChange={setWeight} weight={userData[0]?.weight} isLoading={isLoading}/>
            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.black}]} onPress={handleSave}>
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>{t('save')}</Text>
                </TouchableOpacity>
            </View>
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
        marginTop: 30
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        height: 20,
    },
    title: {
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        marginTop: 40
    }
});

export default EditProfileScreen;
