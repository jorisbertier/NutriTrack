import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import useThemeColors from '@/hooks/useThemeColor';

const NutritionBox = ({ icon, label, value, inputValueGram, onChangeValue }) => {
    if (value === undefined || value === null) return null;

    const colors = useThemeColors();

    // Calcul de la valeur initiale * grammes, arrondie à 2 décimales
    const initialValue = (value * Number(inputValueGram || 0)).toFixed(2);

    // Etat local pour gérer la modification temporaire dans le TextInput
    const [localValue, setLocalValue] = useState(initialValue);

    // Met à jour localValue si inputValueGram ou value changent
    useEffect(() => {
        setLocalValue((value * Number(inputValueGram || 0)).toFixed(2));
    }, [value, inputValueGram]);

    // Gestion changement valeur dans l'input
    const handleChange = (text) => {
        // Accepter uniquement chiffres et '.' (valeur float)
        const regex = /^(\d+)?(\.\d{0,2})?$/;
        if (regex.test(text)) {
            setLocalValue(text);
            // Remonter la valeur en nombre float si possible
            const numberVal = parseFloat(text);
            if (!isNaN(numberVal)) {
                onChangeValue(numberVal);
            } else {
                onChangeValue(0);
            }
        }
    };

    return (
        <View
            style={{
                width: '48%',
                alignItems: 'center',
                marginBottom: 10,
                borderColor: colors.grayPress,
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                borderRadius: 15,
                backgroundColor: 'white',
                // iOS
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.9,
                shadowRadius: 1,
                // Android
                elevation: 1,
            }}
        >
            <View style={{ width: '35%' }}>
                <View
                    style={{
                        height: 30,
                        width: 30,
                        backgroundColor: colors.blueLight,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image source={icon} style={{ height: 16, width: 16 }} />
                </View>
            </View>

            <View style={{ width: '50%', alignItems: 'flex-start' }}>
                <Text>{label}</Text>
                <TextInput
                    style={{
                        borderBottomWidth: 1,
                        borderColor: colors.grayDarkFix,
                        fontSize: 16,
                        width: 80,
                        paddingVertical: 0,
                        paddingHorizontal: 5,
                    }}
                    keyboardType="numeric"
                    value={localValue}
                    onChangeText={handleChange}
                />
            </View>

            <TouchableOpacity
                style={{ width: '15%', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                onPress={() => {
                    /* tu peux éventuellement activer ici une édition plus avancée */
                }}
            >
                <Image source={require('@/assets/images/icon/pencil-black.png')} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
        </View>
    );
};

export default NutritionBox;
