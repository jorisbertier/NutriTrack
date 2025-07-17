import React from 'react';
import { Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';

type Avatar = {
    profileImage: string;
    setProfileImage: (value: string) => void;
    profileImageError: string;
    avatars: any;
}

const AvatarStep = ({
    profileImage,
    setProfileImage,
    profileImageError,
    avatars,
}: Avatar) => {

    const {colors} = useTheme();
    console.log(profileImage)

    return (
    <>

        <Text style={[styles.label, { color: colors.blackFix }]}>Select an avatar</Text>
        <FlatList
        data={avatars}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={styles.avatarList}
        renderItem={({ item }) => (
            <TouchableOpacity
                style={[
                    // styles.avatarContainer,
                    profileImage === item.id && { borderColor: colors.black },
                ]}
                onPress={() => setProfileImage(item.id)}
            >
            <Image source={item.uri} style={styles.image} />
            </TouchableOpacity>
        )}
        />
        {profileImageError ? <Text style={styles.errorText}>{profileImageError}</Text> : null}
    </>
    )
}

const styles = StyleSheet.create({
    label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    avatarList : {
        gap: 20
    },
    errorText: {
        color: 'red',
        marginTop: -10,
        marginBottom: 10
    },
    image: {
        height: 80,
        width: 80
    }
})
export default AvatarStep;
