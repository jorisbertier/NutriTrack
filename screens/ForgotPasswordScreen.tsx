import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordScreen() {

  const [email, setEmail] = useState("");
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState(false);

  const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Succès", "Un lien de réinitialisation a été envoyé à votre email.");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('reset')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: isFocused ? colors.blackFix : colors.grayDarkFix}]}
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.black}]} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>{t('sent')}</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 20 },
  label: { fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    height: 50,
    marginBottom: 20
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  buttonText: { 
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
