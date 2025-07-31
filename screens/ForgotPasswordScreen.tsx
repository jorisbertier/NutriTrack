import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";
import AnimatedToast from "@/components/AnimatedToastProps";

export default function ForgotPasswordScreen() {

  const [email, setEmail] = useState("");
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState(false);
  const [ errorMessage, setErrorMessage] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!email) {
      setErrorMessage(t('emailEmpty'));
      return;
    }
    setErrorMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      showFeedback('success', t('emailSuccess'));
      setEmail('');
    } catch (error) {
      setErrorMessage(t('emailError'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.whiteMode}]}>
      <Text style={styles.label}>{t('reset')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.whiteFix, borderColor: isFocused ? colors.blackBorder : colors.grayDarkBorder}]}
        placeholder={t('email')}
        placeholderTextColor={'grey'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.black}]} onPress={handlePasswordReset}>
        <Text style={[styles.buttonText, { color: colors.white}]}>{t('sent')}</Text>
      </TouchableOpacity>
      {feedback && (
          <AnimatedToast
              message={feedback.message}
              type={feedback.type}
              onHide={() => setFeedback(null)}
              height={100}
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
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
    fontSize: 16,
    fontWeight: '600',
  },
  error : {
    color: 'red',
    width: "90%",
    marginTop: -10,
    fontSize: 15
  }
});
