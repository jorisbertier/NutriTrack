import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, ScrollView, StyleSheet } from 'react-native';

const Terms = () => {
    const { t } = useTranslation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{t('termsTitle')}</Text>
            <Text style={styles.date}>{t('date')}</Text>

            <Text style={styles.sectionTitle}>1. {t('termsTitle1')}</Text>
            <Text style={styles.text}>{t('termsContent')}</Text>

            <Text style={styles.sectionTitle}>2. {t('termsTitle2')}</Text>
            <Text style={styles.text}>{t('termsContent2')}</Text>

            <Text style={styles.sectionTitle}>3. {t('termsTitle3')}</Text>
            <Text style={styles.text}>{t('termsContent3')}</Text>

            <Text style={styles.sectionTitle}>4. {t('termsTitle4')}</Text>
            <Text style={styles.text}>{t('termsContent4')}</Text>

            <Text style={styles.sectionTitle}>5. {t('termsTitle5')}</Text>
            <Text style={styles.text}>{t('termsContent5')}</Text>

            <Text style={styles.sectionTitle}>6. {t('termsTitle6')}</Text>
            <Text style={styles.text}>{t('termsContent6')}</Text>

            <Text style={styles.sectionTitle}>7. {t('termsTitle7')}</Text>
            <Text style={styles.text}>{t('termsContent7')}</Text>

            <Text style={styles.sectionTitle}>8. {t('termsTitle8')}</Text>
            <Text style={styles.text}>{t('termsContent8')}</Text>

            <Text style={styles.sectionTitle}>9. {t('termsTitle9')}</Text>
            <Text style={styles.text}>{t('termsContent9')}</Text>

            <Text style={styles.sectionTitle}>10. {t('termsTitle10')}</Text>
            <Text style={styles.text}>{t('termsContent10')}</Text>

            <Text style={styles.sectionTitle}>11. {t('termsTitle11')}</Text>
            <Text style={styles.text}>{t('termsContent11')}</Text>

            <Text style={styles.sectionTitle}>12. {t('termsTitle12')}</Text>
            <Text style={styles.textContact}>
                {t('termsContent12')}
                {"\n"}nutritiontrack.help@gmail.com
                {/* {"\n"}[Physical address, if applicable] */}
            </Text>
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
});

export default Terms;
