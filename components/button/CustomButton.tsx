import { useTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity, View } from 'react-native';

function CustomButton({titleButton, handlePersistData}: any) {

    const { colors } = useTheme();

    return (
        <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
            <TouchableOpacity
                onPress={handlePersistData} 
                style={[styles.button , { backgroundColor: colors.black}]}
                >
                <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>{titleButton}</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    button: {
        height: 50,
        width: '90%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 20,
    },
})
export default CustomButton