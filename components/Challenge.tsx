import { View, Text, StyleSheet, Image, ImageProps, Pressable } from 'react-native'
import React from 'react';
import { useTheme } from '@/hooks/ThemeProvider';

type Props = {
    source: ImageProps;
    name: string;
    onPress: () => void; 
}
export default function Challenge({source, name, onPress}: Props) {

const {colors} = useTheme();
    return (
        <Pressable  onPress={onPress}>
            <View style={[styles.block, {backgroundColor: colors.grayPress}]}>
                <View style={styles.firstBlock}>
                    <Image source={source} style={styles.firstBlock}/>
                </View>
                <View style={[{backgroundColor: colors.whiteFix}, styles.secondBlock]}>
                    <Text style={[styles.text, {color: colors.blackFix}]}>No {name}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    block: {
        width: 180,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 25,
        marginBottom: 10, 
        marginLeft: 5, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 4,
    },
    firstBlock : {
        height: 80, justifyContent: 'center', alignItems: 'center',width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15
    },
    secondBlock: {
        width: '100%',
        height: 40,
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
        justifyContent: 'center',
        paddingLeft: 15
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    
})