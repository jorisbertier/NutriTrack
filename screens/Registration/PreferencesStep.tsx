import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/hooks/ThemeProvider';

type Props = {
    activityLevel: string;
    setActivityLevel: (value: string) => void;
    activityError: string;
    profileImage: string;
    setProfileImage: (value: string) => void;
    setPassword: (value: string) => void;
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

    const {colors} = useTheme();

    return (
    <>
        <Text style={[styles.label, { color: colors.black }]}>Activity level -</Text>
        <Picker
        selectedValue={activityLevel}
        style={[styles.picker, { backgroundColor: colors.grayPress }]}
        onValueChange={(itemValue) => setActivityLevel(itemValue)}
        >
        <Picker.Item label="Sedentary" value="sedentary" />
        <Picker.Item label="Low Active" value="lowactive" />
        <Picker.Item label="Moderate" value="moderate" />
        <Picker.Item label="Active" value="active" />
        <Picker.Item label="Super Active" value="superactive" />
        </Picker>
        {activityError ? <Text style={styles.errorText}>{activityError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>Select an avatar -</Text>
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
        {profileImageError ? <Text style={styles.errorText}>{profileImageError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>Select your gender -</Text>
        <View style={styles.genderContainer}>
        <TouchableOpacity
            style={[styles.genderButton, gender === 'male' && styles.selectedButton]}
            onPress={() => setGender('male')}
        >
            <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.genderButton, gender === 'female' && styles.selectedButton]}
            onPress={() => setGender('female')}
        >
            <Text>Female</Text>
        </TouchableOpacity>
        </View>
        {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
    </>
    )
}

const styles = StyleSheet.create({
    input : {
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 20
    },
    label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    errorText: {

    },
    genderContainer : {

    },
    genderButton : {

    },
    selectedButton: {
    
    },
    picker : {

    }
})
export default PreferencesStep;
