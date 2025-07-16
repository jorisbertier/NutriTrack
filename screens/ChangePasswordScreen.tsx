import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
    const [passwordError, setPasswordError] = useState('')

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
        <View style={[styles.container, { backgroundColor: colors.whiteMode}]}>
            <TextInput
                style={[styles.input, { backgroundColor: colors.grayPress}]}
                placeholder={t('newPassord')}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={[styles.input, { backgroundColor: colors.grayPress}]}
                placeholder={t('confirmNewPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {passwordError && <Text style={styles.messageError}>{passwordError}</Text>}
            <Button color={colors.primary} title={t('updatePassword')} onPress={handleChangePassword} />
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
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    messageError: {
        color: 'red',
        marginBottom: 20,
        marginTop: -5
    }
});

export default ChangePasswordScreen;
