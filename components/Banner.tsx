import useThemeColors from "@/hooks/useThemeColor";
import { Image, StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = ViewProps

export default function Banner({style, ...rest}: Props) {

    const colors = useThemeColors();
    
    return (
        <View style={styles.banner}>
            <ThemedText style={styles.circle}></ThemedText>
            <ThemedText color={"white"}> Logo</ThemedText>
            <Image source={require('@/assets/images/profil/profil.webp')} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    banner: {
        flex: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F5F5'
    },
    image : {
        width: 60,
        height: 60,
        borderRadius: 30
    }
})