import React from 'react';
import { Text, FlatList, TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

type Avatar = {
    profileImage: string;
    setProfileImage: (value: string) => void;
    profileImageError: string;
    avatars: any;
};

const AvatarStep = ({
    profileImage,
    setProfileImage,
    profileImageError,
    avatars,
}: Avatar) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <>
        <Text style={[styles.label, { color: colors.black }]}>{t('select_avatar')}</Text>
        <FlatList
            data={avatars}
            keyExtractor={(item, index) => `${item.id}-${item.name}-${index}`}
            horizontal
            contentContainerStyle={styles.avatarList}
            renderItem={({ item }) => {
            const isSelected = profileImage === item.id;
            return (
                <TouchableOpacity onPress={() => setProfileImage(item.id)} activeOpacity={0.8}>
                <View
                    style={[
                    styles.avatarContainer,
                    {
                        borderColor: isSelected ? colors.primary : '#ccc',
                        borderWidth: isSelected ? 3 : 0,
                    },
                    ]}
                >
                    <Image source={item.uri} style={styles.image} />
                    {isSelected && (
                    <View style={styles.checkIcon}>
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    </View>
                    )}
                </View>
                </TouchableOpacity>
            );
            }}
        />
        {profileImageError ? <Text style={styles.errorText}>{profileImageError}</Text> : null}
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 5,
    },
    avatarList: {
        gap: 20,
        paddingVertical: 10,
    },
    avatarContainer: {
        borderRadius: 50,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },
    checkIcon: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    errorText: {
        color: 'red',
        marginTop: -10,
        marginBottom: 10,
    },
});

export default AvatarStep;
