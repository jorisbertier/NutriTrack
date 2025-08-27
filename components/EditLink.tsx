import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/hooks/ThemeProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


type EditLinkProps = {
    label: string;
    iconSource: any;
    navigateTo?: string;
    onPress?: () => void;
    isLast?: boolean;
    pro?: boolean
};

const EditLink: React.FC<EditLinkProps> = ({ label, iconSource, navigateTo, onPress, isLast, pro }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

    const handlePress = () => {
    if (!isPremium && pro) {
        return;
    }

    if (onPress) {
        onPress();
    } else if (navigateTo) {
        navigation.navigate(navigateTo as never);
    }
};

    return (
        <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.white, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: isLast ? 'none' : '#ddd' }]}
            onPress={handlePress}
            >
            <View style={styles.leftSection}>
                {iconSource && (
                <Image
                    source={iconSource}
                    style={[styles.icon, { tintColor: colors.black }]}
                />
                )}
                <Text style={[styles.optionText, { color: colors.black }]}>
                {label}
                </Text>
            </View>
            {!isPremium && pro ? (
                <Image
                source={require('@/assets/images/icon/crown.png')}
                style={[styles.arrowIcon, { tintColor: "#FFD700" }]}
            />
            ): (
                <Image
                    source={require('@/assets/images/arrow-right.png')}
                    style={[styles.arrowIcon, { tintColor: colors.black }]}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    optionButton: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    icon: {
        width: 20,
        height: 20,
    },
    arrowIcon: {
        width: 15,
        height: 15,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '400',
    },
});

export default EditLink;
