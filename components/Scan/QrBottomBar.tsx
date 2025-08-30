import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/ThemeProvider';

type BottomInputBarProps = {
    quantityGrams: string;
    setQuantityGrams?: (value: string) => void;
    handleCreateAliment?: () => void;
    selectedMealType?: string;
    setSelectedMealType?: (value: string) => void;
    isPremium?: boolean;
};

export default function BottomInputBarQr({
    quantityGrams,
    setQuantityGrams,
    handleCreateAliment,
    selectedMealType,
    setSelectedMealType,
    isPremium
}: BottomInputBarProps) {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const isDisabled =
        selectedMealType === "" ||
        !/^\d+$/.test(quantityGrams) ||
        Number(quantityGrams) <= 0 ||
        Number(quantityGrams) > 999;
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
                {isPremium ? (
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
                    <Image
                        source={require('@/assets/images/icon/crown.png')}
                        style={{width: 20, height: 20, tintColor: "#FFD700"}}
                    />
                )}
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
        paddingVertical: 10,
        paddingHorizontal: 12,
        zIndex: 999,
        paddingBottom: 50
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pickerWrapper: {
        flex: 1.8,
        borderWidth: 1,
        borderRadius: 6,
        overflow: 'hidden',
    },
    picker: {
        height: 53,
        width: '100%',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
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
        height: 53,
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
