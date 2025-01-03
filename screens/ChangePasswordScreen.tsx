import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useUser } from '@/components/context/UserContext';
import { getAuth, updatePassword } from 'firebase/auth';
import { useTheme } from '@/hooks/ThemeProvider';

const ChangePasswordScreen = ({ navigation }: any) => {

    const { user } = useUser();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {colors} = useTheme();
    const [passwordError, setPasswordError] = useState('')

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match”, “Please try again.");
            return;
        }
        setPasswordError('')
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!confirmPassword || confirmPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            return
        }
        else if(!passwordRegex.test(confirmPassword)) {
            setPasswordError("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
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
                placeholder="New password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={[styles.input, { backgroundColor: colors.grayPress}]}
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {passwordError && <Text style={styles.messageError}>{passwordError}</Text>}
            <Button color={colors.primary} title="Update password" onPress={handleChangePassword} />
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
