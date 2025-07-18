import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const NutritionBox = ({ icon, label, value, onEdit, colors, inputValueGram }) => {
    if (value === undefined || value === null) return null;

    return (
        <View
        style={{
            width: '48%',
            alignItems: 'center',
            marginBottom: 10,
            borderColor: colors.grayDarkFix,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            borderRadius: 10,
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
            <Text>{(value * Number(inputValueGram)).toFixed(2)}</Text>
        </View>

        <TouchableOpacity
            style={{ width: '15%', alignItems: 'flex-end', justifyContent: 'flex-end' }}
            onPress={onEdit}
        >
            <Image source={require('@/assets/images/icon/pencil-black.png')} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
        </View>
    );
};

export default NutritionBox;