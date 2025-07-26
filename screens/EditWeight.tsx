import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import WeightPicker from '@/components/WeightPicker';
import { fetchUserDataConnected } from '@/functions/function';
import { User } from '@/interface/User';
import { Animated } from 'react-native';

const EditProfileScreen = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;

    const [weight, setWeight] = useState(80);
    const [userData, setUserData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [feedbackMessage, setFeedbackMessage] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const feedbackAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            await fetchUserDataConnected(user, setUserData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
        };
        fetchData();
    }, []);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedbackMessage({ type, message });

        Animated.timing(feedbackAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
            Animated.timing(feedbackAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setFeedbackMessage(null));
            }, 2500);
        });
    };

    const handleSave = async () => {
        if (!weight || isNaN(weight) || weight <= 0) {
            showFeedback('error', t('invalid'));
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
                updatedLog[existingIndex] = newEntry;
            } else {
                updatedLog.push(newEntry);
            }

            await updateDoc(userDocRef, {
                weight: Number(weight),
                weightLog: updatedLog,
            });

            showFeedback('success', t('updated'));
            setTimeout(() => navigation.replace('home'), 1000);
        } catch (error) {
            console.error('Error durantly update :', error);
            showFeedback('error', t('update_error'));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.whiteMode }]}>
        <Text style={[styles.title, { color: colors.black }]}>{t('textEditWeight')}</Text>
        <WeightPicker
            selectedWeight={weight}
            onChange={setWeight}
            weight={userData[0]?.weight}
            isLoading={isLoading}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.black }]}
            onPress={handleSave}
            >
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '500' }}>
                {t('save')}
            </Text>
            </TouchableOpacity>
        </View>

        {feedbackMessage && (
            <Animated.View
            style={[
                styles.feedback,
                {
                opacity: feedbackAnim,
                transform: [
                    {
                    translateY: feedbackAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                    }),
                    },
                ],
                backgroundColor:  feedbackMessage.type === 'error' ? '#FF6B6B' : colors.blueLight,
                },
            ]}
            >
            <Text style={[styles.feedbackText, { color: colors.balck}]}>{feedbackMessage.message}</Text>
            </Animated.View>
        )}
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
    },
    feedback: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
    },
    feedbackText: {
        color: '#fff',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default EditProfileScreen;
