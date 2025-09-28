import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/ThemeProvider';
import LottieView from 'lottie-react-native';

type BottomInputBarProps = {
    quantityGrams: string;
    setQuantityGrams?: (value: string) => void;
    handleCreateAliment: () => void;
    selectedMealType: string;
    setSelectedMealType: (value: string) => void;
    loading: boolean;
    secondLoading?: boolean;
    isPremium?: boolean;
};

export default function BottomInputBarQr({
    quantityGrams,
    setQuantityGrams,
    handleCreateAliment,
    selectedMealType,
    setSelectedMealType,
    secondLoading,
    loading,
    isPremium
}: BottomInputBarProps) {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const isDisabled =
        selectedMealType === "" ||
        !/^\d+$/.test(quantityGrams) ||
        Number(quantityGrams) <= 0 ||
        Number(quantityGrams) > 999;

    console.log("second loading", secondLoading)
        return (
        <>
            <View style={[styles.wrapper, { backgroundColor: colors.gray, borderTopColor: colors.grayDark }]}>
            {/* Single compact row */}
            <View style={styles.row}>
                {/* Picker */}
                <View style={[[styles.pickerWrapper, { backgroundColor: colors.whiteFix}]]}>
                    <Picker
                        selectedValue={selectedMealType}
                        onValueChange={(itemValue) => setSelectedMealType(itemValue)}
                        style={[styles.picker, { color: colors.blackFix }]}
                        dropdownIconColor={colors.blackFix}
                        numberOfLines={3}
                    >
                        <Picker.Item label={t('choose')} value="" enabled={false} />
                        <Picker.Item label={`${t('breakfast')} 🍳`} value="Breakfast" />
                        <Picker.Item label={`${t('lunch')} 🍽️`} value="Lunch" />
                        <Picker.Item label={`${t('dinner')} 🍝`} value="Dinner" />
                        <Picker.Item label={`${t('snack')} 🍎`} value="Snack" />
                    </Picker>
                </View>

                {/* Quantity Input */}
                <View style={[styles.inputWrapper, { backgroundColor: colors.whiteFix}]}>
                    <TextInput
                        keyboardType="numeric"
                        value={quantityGrams}
                        onChangeText={(text) => {
                        if (/^\d*$/.test(text)) {
                            setQuantityGrams(text);
                        }
                        }}
                        style={[styles.input, { color: colors.blackFix, borderColor: colors.grayDark }]}
                        placeholder="100"
                        placeholderTextColor={colors.grayDark}
                        maxLength={3}
                    />
                    <Text style={[styles.unit, { color: colors.blackFix }]}>g </Text>
                </View>

                {/* Add Button */}
                {/* Add Button */}
                    <View style={{width: "25%", height: 60, justifyContent: "center", alignItems: "center"}}>
                        {isPremium ? (
                            !loading ? (
                                <TouchableOpacity
                                style={[
                                    styles.button,
                                    { backgroundColor: isDisabled ? colors.grayDarkFix : colors.blackFix }
                                ]}
                                onPress={handleCreateAliment}
                                disabled={isDisabled}
                                >
                                    <Text style={[styles.buttonText, { color: colors.whiteFix }]}>{t('add')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <LottieView
                                source={require('@/assets/lottie/Black Check.json')}
                                loop={false}
                                style={{ width: 50, height: 50 }}
                                autoPlay={true}
                                />
                            )
                            ) : (
                            <Image
                                source={require('@/assets/images/icon/crown.png')}
                                style={{ width: 20, height: 20, tintColor: "#FFD700" }}
                            />
                        )}
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 12,
        zIndex: 999,
        height: 110,
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
        pickerWrapper: {
        flex: 1.8,
        overflow: 'hidden',
        borderTopRightRadius: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    picker: {
        height: 53,
        width: '100%',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
    },
    input: {
        flex: 1,
        height: 53,
    },
    unit: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        flex: 0.9,
        height: "100%",
        width: "100%",
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
