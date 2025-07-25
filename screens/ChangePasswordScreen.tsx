import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useUser } from '@/components/context/UserContext';
import { getAuth, updatePassword } from 'firebase/auth';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = ({ navigation }: any) => {

    const { user } = useUser();
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {colors} = useTheme();
    const [passwordError, setPasswordError] = useState('');
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: false }));
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError(t('passwordError'));
            return;
        }
        setPasswordError('')
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!confirmPassword || confirmPassword.length < 6) {
            setPasswordError(t('passwordError2'));
            return
        }
        else if(!passwordRegex.test(confirmPassword)) {
            setPasswordError(t('passwordError3'));
            return
        }
        else {
            setPasswordError('');
        }
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                await updatePassword(currentUser, newPassword);
                Alert.alert("Success", "Your password has been updated.")
                navigation.goBack();
            } else {
                Alert.alert("Erreur", "User not authenticated.");
            }
        } catch (error) {
            console.error("Error", "User not authenticated. :", error);
            Alert.alert("Error", "Unable to update password. Try again");
        }
    };

    return (
        <View style={[styles.container]}>
            <TextInput
                style={[styles.input, {backgroundColor: colors.white, borderColor: focusedFields['newPassword'] ? colors.black : colors.grayDarkFix}]}
                placeholder={t('newPassord')}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => handleFocus('newPassword')}
                onBlur={() => handleBlur('newPassword')}
            />
            <TextInput
                style={[styles.input, { backgroundColor: colors.white, borderColor: focusedFields['confirmPassword'] ? colors.black : colors.grayDarkFix}]}
                placeholder={t('confirmNewPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
            />
            {passwordError && <Text style={styles.messageError}>{passwordError}</Text>}
            {/* <Button color={colors.primary} title={t('updatePassword')} onPress={handleChangePassword} /> */}
                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
                <TouchableOpacity style={[styles.button,{backgroundColor: colors.black}]} onPress={handleChangePassword}>
                    <Text style={[styles.buttonText, { color : colors.white}]}>{t('save')}</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 3,
        paddingHorizontal: 10,
        marginTop: 20
    },
    messageError: {
        color: 'red',
        marginBottom: 20,
        marginTop: -5
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
});

export default ChangePasswordScreen;
