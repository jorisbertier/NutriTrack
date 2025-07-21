import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('privcayPolicy')}</Text>
                <Text style={styles.date}>{t('effectiveDate')}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>{t('privacyTitle1')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent1')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle2')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent2')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle3')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent3')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle4')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent4')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle5')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent5')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle6')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent6')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle7')}</Text>
                <Text style={styles.sectionText}>{t('privacyContent7')}</Text>

                <Text style={styles.sectionTitle}>{t('privacyTitle8')}</Text>
                <Text style={styles.sectionText}>
                {t('privacyContent8')}
                {'\n\n'}
                Nutrition Track{'\n'}
                Email : nutritiontrack.help@gmail.com{'\n'}
                Whatsapp: +3368594525
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        marginBottom: 60,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
    },
    content: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 15,
    },
    sectionText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#444',
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
});

export default PrivacyPolicy;
