import React from 'react';
import { Text, TextInput } from 'react-native';

type Props = {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    emailError: string;
    passwordError: string;
    colors: {
        [key: string]: string;
    };
    styles: any;
}


const CredentialsStep = ({ email, setEmail, password, setPassword, emailError, passwordError, colors, styles }: Props) => (
    <>
        <Text style={[styles.label, { color: colors.black }]}>Email -</Text>
        <TextInput
            style={[styles.input, { backgroundColor: colors.grayPress }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>Password -</Text>
        <TextInput
            style={[styles.input, { backgroundColor: colors.grayPress }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
    </>
);

export default CredentialsStep;