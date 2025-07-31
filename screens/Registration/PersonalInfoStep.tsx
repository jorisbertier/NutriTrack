import { useTheme } from '@/hooks/ThemeProvider';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

type PersonalInfoStepProps = {
    name: string;
    setName: (value: string) => void;
    firstname: string;
    setFirstname: (value: string) => void;
    dateOfBirthFormatted: string;
    showDatePicker: boolean;
    setShowDatePicker: (value: boolean) => void;
    onChangeDate: (event: any, selectedDate?: Date) => void;
    dateOfBirthError: string;
    nameError: string;
    firstnameError: string;
    dateOfBirth: Date;
    fiveYearsAgo: Date;
}



const PersonalInfoStep = ({ name, setName, firstname, setFirstname, dateOfBirthFormatted, showDatePicker, setShowDatePicker, onChangeDate, nameError, firstnameError, dateOfBirthError, dateOfBirth, fiveYearsAgo }: PersonalInfoStepProps) => {
    
    const {colors} = useTheme();
    const { t } = useTranslation();
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isFirstnameFocused, setIsFirstnameFocused] = useState(false);

    return (
        <>
            <Text style={[styles.label, { color: colors.blackFix }]}>{t('name')}</Text>
            <TextInput
                style={[styles.input, { borderColor: isNameFocused ? colors.blackFix : colors.grayDarkFix,  borderWidth: isNameFocused ? 2 : 1 }]}
                value={name}
                onChangeText={setName}
                placeholder={t('name')}
                autoCapitalize='words'
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <Text style={[styles.label, { color: colors.blackFix }]}>{t('firstName')}</Text>
            <TextInput
                onFocus={() => setIsFirstnameFocused(true)}
                onBlur={() => setIsFirstnameFocused(false)}
                style={[styles.input, { borderColor: isFirstnameFocused ? colors.blackFix : colors.grayDarkFix,  borderWidth: isFirstnameFocused ? 2 : 1 }]}
                value={firstname}
                onChangeText={setFirstname}
                placeholder={t('firstName')}
                autoCapitalize='words'
            />
            {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}

            <Text style={[styles.label, { color: colors.black }]}>{t('dateOfBirth')}</Text>
            <View style={[styles.dateInput, { borderColor: colors.grayDarkFix, backgroundColor: colors.whiteFix}]}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}  >
                    <Image source={require('@/assets/images/calendarBirth.png')} style={{ height: 25, width: 25}} />
                </TouchableOpacity >
                <View>
                    <Text style={styles.textDateFirst}>{t('date')}</Text>
                    <Text style={styles.textDate}>{dateOfBirthFormatted || "- - - -"}</Text>
                </View>
                </View>
            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={fiveYearsAgo}
                />
            )}
            {dateOfBirthError && <Text style={styles.errorText}>{dateOfBirthError}</Text>}
        </>
    )
};

const styles = StyleSheet.create({
    input : {
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 20,
        fontSize: 15,
        fontWeight: 500
    },
    label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        marginTop: -10
    },
    dateInput: {
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 20,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
        borderWidth: 1
    },
    textDateFirst : {
        fontWeight: 400
    },
    textDate : {
        fontSize: 15,
        fontWeight: 500
    },
    picker : {

    }
})

export default PersonalInfoStep;
