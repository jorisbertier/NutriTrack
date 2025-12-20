import { useTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, ScrollView, StyleSheet, Linking, Pressable } from 'react-native';

const Terms = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.whiteMode}]}>
            <Text style={[styles.title, { color: colors.black }]}>{t('termsTitle')}</Text>
            <Text style={styles.date}>{t('dateTerms')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>1. {t('termsTitle1')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>2. {t('termsTitle2')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent2')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>3. {t('termsTitle3')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent3')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>4. {t('termsTitle4')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent4')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>5. {t('termsTitle5')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent5')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>6. {t('termsTitle6')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent6')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>7. {t('termsTitle7')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent7')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>8. {t('termsTitle8')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent8')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>9. {t('termsTitle9')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent9')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>10. {t('termsTitle10')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent10')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>11. {t('termsTitle11')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>{t('termsContent11')}</Text>

            <Text style={[styles.sectionTitle, { color: colors.black }]}>12. {t('termsTitle12')}</Text>
            <Text style={[styles.text, { color: colors.black }]}>
                {t('termsContent12')}
                {"\n"}{"\n"}nutritrack.contact@gmail.com
                {/* {"\n"}[Physical address, if applicable] */}
            </Text>
            <Pressable
            onPress={async () => {
                const url = 'mailto:nutritrack.contact@gmail.com';
                const supported = await Linking.canOpenURL(url);

                console.log('MAIL SUPPORTED:', supported);

                if (supported) {
                Linking.openURL(url);
                } else {
                alert('Aucune application mail détectée');
                }
            }}
            >
                <Text style={styles.email}>
                    nutritrack.contact@gmail.com
                </Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    date: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 20,
        color: 'gray',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    text: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    textContact: {
        fontSize: 14,
        marginBottom: 100,
        lineHeight: 20,
    },
    email: {
        color: '#4A90E2',
        textDecorationLine: 'underline',
        fontWeight: '500',
    }
});

export default Terms;
