import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/ThemeProvider';

type BottomInputBarProps = {
    filterUniqueFood: {
        unit: string;
    };
    quantityGrams: string;
    setQuantityGrams: (value: string) => void;
    handleCreateAliment: () => void;
    selectedMealType: string;
    setSelectedMealType: (value: string) => void;
};

export default function BottomInputBar({
    filterUniqueFood,
    quantityGrams,
    setQuantityGrams,
    handleCreateAliment,
    selectedMealType,
    setSelectedMealType,
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
        {filterUniqueFood?.unit === 'g' && (
            <View style={[styles.wrapper, { backgroundColor: colors.grayMode, borderTopColor: colors.grayDark }]}>
            {/* Single compact row */}
            <View style={styles.row}>
                {/* Picker */}
                <View style={[[styles.pickerWrapper, { backgroundColor: colors.white}]]}>
                <Picker
                    selectedValue={selectedMealType}
                    onValueChange={(itemValue) => setSelectedMealType(itemValue)}
                    style={[styles.picker, { color: colors.black }]}
                    dropdownIconColor={colors.black}
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
                <View style={[styles.inputWrapper, { backgroundColor: colors.white}]}>
                <TextInput
                    keyboardType="numeric"
                    value={quantityGrams}
                    onChangeText={(text) => {
                    if (/^\d*$/.test(text)) {
                        setQuantityGrams(text);
                    }
                    }}
                    style={[styles.input, { color: colors.black, borderColor: colors.grayDark }]}
                    placeholder="100"
                    placeholderTextColor={colors.grayDark}
                    maxLength={3}
                />
                <Text style={[styles.unit, { color: colors.black }]}>g</Text>
                </View>

                {/* Add Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: isDisabled ? colors.grayDark : colors.black }
                    ]}
                    onPress={handleCreateAliment}
                    disabled={isDisabled}
                    >
                    <Text style={[styles.buttonText, { color: colors.white }]}>Ajouter</Text>
                </TouchableOpacity>
            </View>
            </View>
        )}
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
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: -2 },
        elevation: 8,
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
