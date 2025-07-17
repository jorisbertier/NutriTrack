import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/hooks/ThemeProvider';
import LottieView from 'lottie-react-native';



type Props = {
    activityLevel: string;
    setActivityLevel: (value: string) => void;
    activityError: string;
    profileImage: string;
    setProfileImage: (value: string) => void;
    gender: string;
    setGender: (value: string) => void;
    genderError: string;
    profileImageError: string;
    avatars: any;
}


const PreferencesStep = ({
    activityLevel,
    setActivityLevel,
    activityError,
    profileImage,
    setProfileImage,
    gender,
    setGender,
    genderError,
    profileImageError,
    avatars,
}: Props) => {
    console.log(gender)

    const {colors} = useTheme();
    return (
    <>
  <LottieView
    source={require('@/assets/lottie/success.json')} // ou depuis une URL
    autoPlay
    loop={false}
    style={{ width: 150, height: 150 }}
  />
        <Text style={[styles.label, { color: colors.black, marginTop: 20 }]}>Activity level</Text>
        <View style={styles.picker}>
            <Picker
                selectedValue={activityLevel}
                style={[{ backgroundColor: colors.whiteFix }]}
                onValueChange={(itemValue) => setActivityLevel(itemValue)}
            >
            <Picker.Item label="Sedentary" value="sedentary" />
            <Picker.Item label="Low Active" value="lowactive" />
            <Picker.Item label="Moderate" value="moderate" />
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Super Active" value="superactive" />
            </Picker>
        </View>
        {activityError ? <Text style={styles.errorText}>{activityError}</Text> : null}

        {/* <Text style={[styles.label, { color: colors.black }]}>Select an avatar -</Text>
        <FlatList
        data={avatars}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        // contentContainerStyle={styles.avatarList}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={[
                // styles.avatarContainer,
                profileImage === item.id && { borderColor: colors.black },
            ]}
            onPress={() => setProfileImage(item.id)}
            >
            <Image source={item.uri} />
            </TouchableOpacity>
        )}
        />
        {profileImageError ? <Text style={styles.errorText}>{profileImageError}</Text> : null} */}

        <Text style={[styles.label, { color: colors.black }]}>Select your gender</Text>
        <TouchableOpacity
            style={[styles.genderContainer, { backgroundColor: gender === "male" ? colors.primary : colors.whiteFix, borderColor: gender === "male" ? colors.blackFix : colors.grayDarkFix }]}
            onPress={() => setGender('male')}
        >
            <Text>Male</Text>
            <View style={[styles.circle, { backgroundColor : gender === "male" ? colors.blackFix : colors.whiteFix}]}>
                {gender === "male" && <View style={{backgroundColor: colors.whiteFix, height: 5, width: 5, borderRadius: "50%"}}></View>}
            </View>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.genderContainer, { backgroundColor: gender === "female" ? colors.primary : colors.whiteFix, borderColor: gender === "female" ? colors.blackFix : colors.grayDarkFix}]}
            onPress={() => setGender('female')} 
        >
            <Text>Female</Text>
            <View style={[styles.circle, { backgroundColor: gender === "female" ? colors.blackFix : colors.whiteFix}]}>
                {gender === "female" && <View style={{backgroundColor: colors.whiteFix, height: 5, width: 5, borderRadius: "50%"}}></View>}
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
        height: 13,
        width: 13,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
