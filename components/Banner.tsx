import useThemeColors from "@/hooks/useThemeColor";
import { Image, StyleSheet, Text, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import Row from "./Row";

type Props = {
    name: string;
}

export default function Banner({name}: Props) {

    const date = new Date();
    const colors = useThemeColors();
    
    return (
        <View style={styles.wrapperBanner}>
            <View style={styles.banner}>
            <Row style={{justifyContent: 'space-between', width: '90%'}}>
                <View style={{flexDirection: 'row', gap: 10}}>
                    <Image source={require('@/assets/images/calendarGray.png')} style={styles.imageMini} />
                    <ThemedText color={colors.grayPress} style={{fontSize: 15, fontWeight: 800}}>{capitalizeFirstLetter(date.toLocaleString('default', { month: 'short' }))} {date.getDate()},  {date.getFullYear()}</ThemedText>
                </View>
                <View style={[styles.circle]}>
                    <Image source={require('@/assets/images/notificationLight.png')} style={styles.imageMini} />
                </View>
            </Row>
            <View style={{flexDirection: 'row', gap: 20, justifyContent: 'flex-start', width: '90%', marginBottom: -50}}>
                <Image source={require('@/assets/images/profil/profil.webp')} style={styles.imageProfil} />
                <View style={{flexDirection: 'column'}}>
                    <Text style={{color: 'white', fontSize: 30, fontWeight: 800, letterSpacing: 2}}>Hello, {name} !</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('@/assets/images/star.png')} style={styles.imageMini} />
                        <ThemedText color="#FFFF">Free account</ThemedText>
                    </View>
                </View>
            </View>
            </View>
            <Image source={require('@/assets/images/backgroundBlack.jpg')} style={styles.imageBackground}/>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperBanner : {
        position: 'relative',
        height: 230,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    banner : {
        width: '100%',
        height: 230,
        gap: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        borderRadius: 100,
        
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#383B42',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageProfil : {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    imageMini : {
        width: 15,
        height: 15,
    },
    imageBackground : {
        position: 'absolute',
        width: '100%',
        height: 230,
        objectFit: 'fill',
        zIndex: -1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    }
})