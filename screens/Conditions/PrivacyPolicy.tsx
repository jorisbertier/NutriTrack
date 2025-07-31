import { useTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, {backgroundColor: colors.whiteMode}]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.black}]}>{t('privcayPolicy')}</Text>
                <Text style={styles.date}>{t('effectiveDate')}</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle1')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent1')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle2')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent2')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle3')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent3')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle4')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent4')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle5')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent5')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle6')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent6')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle7')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>{t('privacyContent7')}</Text>

                <Text style={[styles.sectionTitle, { color: colors.black }]}>{t('privacyTitle8')}</Text>
                <Text style={[styles.sectionText, { color: colors.black }]}>
                {t('privacyContent8')}
                {'\n\n'}
                Nutrition Track{'\n'}{'\n'}
                Email : nutritrack.contact@gmail.com{'\n'}
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
