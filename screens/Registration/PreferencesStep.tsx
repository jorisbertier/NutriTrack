import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';

type Props = {
    activityLevel: string;
    setActivityLevel: (value: string) => void;
    activityError: string;
    gender: string;
    setGender: (value: string) => void;
    genderError: string;
}

const PreferencesStep = ({
    activityLevel,
    setActivityLevel,
    activityError,
    gender,
    setGender,
    genderError,
}: Props) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const activityOptions = [
        { id: 'sedentary', label: t('sedentary') },
        { id: 'lowactive', label: t('lowactive') },
        { id: 'moderate', label: t('moderate') },
        { id: 'active', label: t('active') },
        { id: 'superactive', label: t('superactive') },
    ];

    const renderOption = (currentValue: string, value: string, label: string, onSelect: (v: string) => void) => {
        const isSelected = currentValue === value;
        return (
            <TouchableOpacity
                key={value}
                activeOpacity={0.7}
                style={[
                    styles.card,
                    { 
                        backgroundColor: isSelected ? colors.blueLight : colors.whiteFix, 
                        borderColor: '#E0E0E0' 
                    }
                ]}
                onPress={() => onSelect(value)}
            >
                <Text style={[styles.cardText, { color: colors.black }]}>{label}</Text>
                {/* <View style={[
                    styles.customRadio, 
                    { borderColor: isSelected ? colors.blackFix : '#CCC', backgroundColor: isSelected ? colors.blackFix : 'transparent' }
                ]}>
                    {isSelected && <Image style={styles.checkIcon} source={require('@/assets/images/icon/check-light.png')} />}
                </View> */}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Niveau d'activité - Version Modern Chips/Cards */}
            <Text style={[styles.label, { color: colors.black }]}>{t('activityLevel')}</Text>
            <View style={styles.optionsGrid}>
                {activityOptions.map((opt) => renderOption(activityLevel, opt.id, opt.label, setActivityLevel))}
            </View>
            {activityError ? <Text style={styles.errorText}>{activityError}</Text> : null}

            <View style={{ height: 20 }} />

            {/* Genre */}
            <Text style={[styles.label, { color: colors.black }]}>{t('select_gender')}</Text>
            <View style={styles.row}>
                {['male', 'female'].map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[
                            styles.genderCard,
                            { 
                                backgroundColor: gender === g ? colors.blueLight : colors.whiteFix, 
                                borderColor: '#E0E0E0' 
                            }
                        ]}
                        onPress={() => setGender(g)}
                    >
                        <Text style={styles.genderText}>{t(`gender_${g}`)}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    label: {
        fontWeight: '700',
        fontSize: 20,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    optionsGrid: {
        gap: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 20,
        borderWidth: 1.5,
        // Elevation pour Android
        elevation: 2,
        // Shadow pour iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    customRadio: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        height: 12,
        width: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    genderCard: {
        flex: 1,
        height: 55,
        borderRadius: 20,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    genderText: {
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
});

export default PreferencesStep;