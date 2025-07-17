import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
  colors,
  styles,
  avatars,
}) => (
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
        contentContainerStyle={styles.avatarList}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={[
                styles.avatarContainer,
                profileImage === item.id && { borderColor: colors.black },
            ]}
            onPress={() => setProfileImage(item.id)}
            >
            <Image source={item.uri} style={styles.avatarImage} />
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
            <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.genderButton, gender === 'female' && styles.selectedButton]}
            onPress={() => setGender('female')}
        >
            <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
        </View>
        {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
    </>
);

export default PreferencesStep;
