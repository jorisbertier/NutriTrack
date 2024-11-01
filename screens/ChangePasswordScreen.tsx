import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useUser } from '@/components/context/UserContext';
import { getAuth, updatePassword } from 'firebase/auth';
import useThemeColors from '@/hooks/useThemeColor';

const ChangePasswordScreen = ({ navigation }: any) => {
    const { user } = useUser();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const colors = useThemeColors()

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
        Alert.alert("Passwords do not match”, “Please try again.");
        return;
        }

        try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            await updatePassword(currentUser, newPassword);
            Alert.alert("Success", "Your password has been updated.")
            navigation.goBack();
        } else {
            Alert.alert("Erreur", "Utilisateur non authentifié.");
        }
        } catch (error) {
        console.error("Error", "User not authenticated. :", error);
        Alert.alert("Error", "Unable to update password.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="New password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button color={colors.primary} title="Update password" onPress={handleChangePassword} />
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

export default ChangePasswordScreen;
