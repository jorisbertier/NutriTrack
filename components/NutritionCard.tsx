import { Image, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { Dimensions } from 'react-native';
import { capitalizeFirstLetter } from "@/functions/function";
import useThemeColors from "@/hooks/useThemeColor";

type Props = {
    style?: ViewStyle,
    icon?: string | undefined,
    nutritionalName: string,
    nutrionalData: string,
    backgroundcolor: string,
    indice: string,
    textColor?: string
}

const imageMapping: { [key: string ]: any } = {
    'burn': require('@/assets/images/nutritional/burn.png'),
    'protein': require('@/assets/images/nutritional/protein.png'),
    'carbs': require('@/assets/images/nutritional/carbs.png'),
    'fat': require('@/assets/images/nutritional/fat.png'),
};

export default function NutritionalCard({icon, textColor = 'black', nutritionalName, nutrionalData, indice, backgroundcolor, style, ...rest}: Props) {

    const colors = useThemeColors();
    const imageSource = imageMapping[icon];
    
    console.log(icon)
    return (
        <View style={[styles.card, {backgroundColor: backgroundcolor}]}>
            <View style={styles.block1}>
                <ThemedText variant="title1" color={textColor}>{capitalizeFirstLetter(nutritionalName)}</ThemedText>
                <View style={styles.wrapperImage}>
                    <Image source={imageSource} style={styles.icon}/>
                </View>
            </View>
            <View style={styles.block2}>
                <ThemedText variant="title1" color={textColor}>
                    {nutrionalData} 
                    <ThemedText variant="title1" color={'grayDark'}>
                        {' ' + indice}
                    </ThemedText>
                    </ThemedText>
            </View>
        </View>
    )
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    card : {
        // flex: 1/2,
        width: '49%',
        marginVertical: 2,
        height: height * 0.2,
        borderRadius: 20,
        padding: 12,
        justifyContent: 'space-between',
        
    },
    bodyCard: {
    },
    icon : {
        height: 20,
        width: 20,
        
    },
    wrapperImage : {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    block1 : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    block2 : {},
})