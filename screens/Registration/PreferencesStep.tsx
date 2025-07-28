import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/hooks/ThemeProvider';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../functions/function';



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
    console.log(gender)

    const {colors} = useTheme();
    const { t } = useTranslation();

    return (
    <>
        <Text style={[styles.label, { color: colors.black, marginTop: 20 }]}>{t('activityLevel')}</Text>
        <View style={styles.picker}>
            <Picker
                selectedValue={activityLevel}
                style={[{ backgroundColor: colors.whiteFix }]}
                onValueChange={(itemValue) => setActivityLevel(itemValue)}
            >
            <Picker.Item label={t('sedentary')} value="sedentary" />
            <Picker.Item label={t('lowactive')} value="lowactive" />
            <Picker.Item label={t('moderate')} value="moderate" />
            <Picker.Item label={t('active')} value="active" />
            <Picker.Item label={t('superactive')} value="superactive" />
            </Picker>
        </View>
        {activityError ? <Text style={styles.errorText}>{activityError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>{t('select_gender')}</Text>
        <TouchableOpacity
            style={[styles.genderContainer, { backgroundColor: gender === "male" ? colors.blueLight : colors.whiteFix, borderColor: gender === "male" ? colors.blackFix : colors.grayDarkFix }]}
            onPress={() => setGender('male')}
        >
            <Text style={{textTransform: 'capitalize'}}>{t('gender_male')}</Text>
            <View style={[styles.circle, { backgroundColor : gender === "male" ? colors.blackFix : colors.whiteFix}]}>
                {gender === "male" && <Image style={styles.image} source={require('@/assets/images/icon/check-light.png')}/>}
            </View>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.genderContainer, { backgroundColor: gender === "female" ? colors.blueLight : colors.whiteFix, borderColor: gender === "female" ? colors.blackFix : colors.grayDarkFix}]}
            onPress={() => setGender('female')} 
        >
            <Text style={{textTransform: 'capitalize'}}>{t('gender_female')}</Text>
            <View style={[styles.circle, { backgroundColor: gender === "female" ? colors.blackFix : colors.whiteFix}]}>
                {gender === "female" && <Image style={styles.image} source={require('@/assets/images/icon/check-light.png')}/>}
            </View>
        </TouchableOpacity>
        {genderError ? <Text style={styles.errorTextGender}>{genderError}</Text> : null}
    </>
    )
}

const styles = StyleSheet.create({
    label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    circle : {
        height: 20,
        width: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 15,
        width: 15,
    },
    errorText: {
        color: 'red',
        marginTop: -10,
        marginBottom: 10
    },
    errorTextGender: {
        color: 'red',
        marginTop: -5,
        marginBottom: 15
    },
    genderContainer : {
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center',
        paddingHorizontal: 20,
    },
    picker : {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20
    }
})
export default PreferencesStep;
