import { Image, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { Dimensions } from 'react-native';
import { capitalizeFirstLetter } from "@/functions/function";
import { Skeleton } from "moti/skeleton";
import { colorMode } from "@/constants/Colors";
import { useTheme } from "@/hooks/ThemeProvider";

type Props = {
    style?: ViewStyle,
    icon?: string | undefined,
    nutritionalName: string,
    nutrionalData: string | null | number,
    backgroundcolor: string,
    indice: string,
    setState: any,
    goal: number,
    showIcon: boolean,
}

const imageMapping: { [key: string ]: any } = {
    'burn': require('@/assets/images/nutritional/burn.png'),
    'protein': require('@/assets/images/nutritional/protein.png'),
    'carbs': require('@/assets/images/nutritional/house.png'),
    'fat': require('@/assets/images/nutritional/watermelon.png'),
};


export default function NutritionalCard({icon, nutritionalName,setState, nutrionalData, indice, backgroundcolor, style, goal, showIcon, ...rest}: Props) {
    
    const { colors } = useTheme();
    const imageSource = imageMapping[icon];
    
    const totalValue = Number(nutrionalData ?? 0) + Number(goal ?? 0);

    return (
        <View style={[styles.card, {backgroundColor: backgroundcolor}]}>
            <View style={styles.block1}>
            {/* <Skeleton colorMode={colorMode} width={70}> */}
                <ThemedText variant="title1" color={colors.blackFix}>{capitalizeFirstLetter(nutritionalName)}</ThemedText>
            {/* </Skeleton> */}
                <Skeleton colorMode={colorMode} height={30} width={30} radius={'round'}>
                {setState && <View style={styles.wrapperImage}>
                    <Image source={imageSource} style={styles.icon}/>
                </View>
                }
                </Skeleton>
            </View>
            <View style={styles.valueRow}>
                <Skeleton colorMode={colorMode} width={100} height={30} radius={8}>
                    <View style={styles.rowContent}>
                    {showIcon && goal > 0 && (
                        <Image
                        source={require('@/assets/images/icon/goal.png')}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        />
                    )}
                    {setState && (
                        <ThemedText variant="title1" color={colors.blackFix}>
                        {totalValue} {indice}
                        </ThemedText>
                    )}
                    </View>
                </Skeleton>
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 3,
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
    valueRow: {
        width: '100%',
        marginTop: 5,
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 5,
        marginTop: 5
    },
})