import { View, Text, StyleSheet, Image, ImageProps } from 'react-native'
import React from 'react'
import useThemeColors from '@/hooks/useThemeColor';

type Props = {
    source: ImageProps;
    data: string;
}
export default function Challenge({source, data}: Props) {

const colors = useThemeColors()
  return (
    <View style={[styles.block, {backgroundColor: colors.grayPress}]}>
        <View style={styles.firstBlock}>
            <Image source={source} style={styles.firstBlock}/>
        </View>
        <View style={[{backgroundColor: colors.white}, styles.secondBlock]}>
            <Text style={[styles.text, {color: colors.black}]}>No {data}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    block: {
        width: 180,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 15,
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