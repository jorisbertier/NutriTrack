import { useTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

type Props = {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    emailError: string;
    passwordError: string;
}


const CredentialsStep = ({ email, setEmail, password, setPassword, emailError, passwordError }: Props) => {
    
    const {colors} = useTheme();
    
    return (
        <>
            <Text style={[styles.label, { color: colors.black, marginTop: 20 }]}>Email</Text>
            <TextInput
                style={[styles.input,{  borderColor: colors.blackFix } ]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={[styles.label, { color: colors.black }]}>Password</Text>
            <TextInput
                style={[styles.input, { color: colors.blackFix }]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {passwordError ? <Text>{passwordError}</Text> : null}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    nextButton: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: 'black',
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input : {
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 20
    },
    label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    errorText: {

    }
});

export default CredentialsStep;