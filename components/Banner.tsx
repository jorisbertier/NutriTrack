import useThemeColors from "@/hooks/useThemeColor";
import { Image, StyleSheet, Text, View, Modal, Alert, Pressable, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { ThemedText } from "./ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import Row from "./Row";
import { useState } from "react";

type Props = {
    name: string;
}

export default function Banner({name}: Props) {

    const date = new Date();
    const colors = useThemeColors();

    const [modalVisible, setModalVisible] = useState(false);

    const handleBackgroundPress = () => {
        setModalVisible(false);
    };
    
    return (
        <View style={styles.wrapperBanner}>
            <View style={styles.banner}>
            <Row style={{justifyContent: 'space-between', width: '90%'}}>
                <View style={{flexDirection: 'row', gap: 10}}>
                    <Image source={require('@/assets/images/calendarGray.png')} style={styles.imageMini} />
                    <ThemedText color={colors.grayPress} style={{fontSize: 15, fontWeight: 800}}>{capitalizeFirstLetter(date.toLocaleString('default', { month: 'short' }))} {date.getDate()},  {date.getFullYear()}</ThemedText>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <View style={[styles.circle]} >
                        <Image source={require('@/assets/images/notificationLight.png')} style={styles.imageMini} />
                    </View>
                </TouchableOpacity>
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                    <View style={stylesModal.modalBackground}>
                        <View style={[stylesModal.modalContainer, {backgroundColor: colors.grayPress}]}>
                            <Text style={stylesModal.modalHeader}>Notifications</Text>
                            <Text style={stylesModal.modalText}>You have no notifications at the moment.</Text>
                            {/* <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={stylesModal.closeText}>Close</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperBanner : {
        zIndex: 2,
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

const stylesModal = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: 'relative'
    },
    modalContainer: {
        width: 300,
        top: -250,
        left: 25,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left',
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#333', // Couleur du texte
    },
})