import { Image, StyleSheet, Text, View, Modal, Alert, Pressable, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { ThemedText } from "./ThemedText";
import { capitalizeFirstLetter, getIdAvatarProfile } from "@/functions/function";
import Row from "./Row";
import { useEffect, useState } from "react";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/hooks/ThemeProvider";

type Props = {
    name: string;
    isLoading: boolean,
    profilePictureId: number
}

export default function Banner({name, isLoading, profilePictureId}: Props) {

    const avatar = getIdAvatarProfile(profilePictureId)

    const date = new Date();
    const {colors, toggleTheme, theme} = useTheme();
    const colorMode: 'light' | 'dark' = 'light';
    const greetings = ['Hi','こんにちは','Hola', 'Bonjour' ];

    const [currentGreeting, setCurrentGreeting] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentGreeting((currentGreeting) => (currentGreeting + 1) % greetings.length)
        }, 8000)

        return () => clearInterval(intervalId)
    },[])

    const handleBackgroundPress = () => {
        setModalVisible(false);
    };
    
    return (
        <View style={[styles.wrapperBanner, {backgroundColor: colors.white}]}>
            <View style={[styles.banner]}>
                <Row style={{justifyContent: 'space-between', width: '90%'}}>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Image source={require('@/assets/images/calendarGray.png')} style={styles.imageMini} />
                        <ThemedText color={colors.gray} style={{fontSize: 15, fontWeight: 800}}>{capitalizeFirstLetter(date.toLocaleString('default', { month: 'short' }))} {date.getDate()},  {date.getFullYear()}</ThemedText>
                    </View>
                    <TouchableOpacity onPress={toggleTheme}>
                        <View style={[styles.circle]} >
                            {theme === "light" ?
                                <Image source={require('@/assets/images/darkmode/sun.png')} style={styles.imageMini} />
                            :
                                <Image source={require('@/assets/images/darkmode/moon.png')} style={styles.imageMini} />
                            }
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={[styles.circle]} >
                            <Image source={require('@/assets/images/notificationLight.png')} style={styles.imageMini} />
                        </View>
                    </TouchableOpacity> */}
                </Row>
                <View style={{flexDirection: 'row', gap: 20, justifyContent: 'flex-start', width: '90%', marginBottom: -50}}>
                    <Skeleton colorMode={colorMode} width={60} height={60} radius={'round'}>
                        {isLoading ?
                            <Image source={avatar} style={styles.imageProfil} />
                        : null}
                    </Skeleton>
                        <View style={{flexDirection: 'column'}}>
                        {isLoading ? 
                            <Text style={{color: 'white', fontSize: 30, maxWidth: 280, fontWeight: 800, letterSpacing: 2, flexWrap: 'wrap'}}>{greetings[currentGreeting]}, {name}!</Text>
                        :
                        <Skeleton colorMode={colorMode} width={200} height={30} />
                        }
                        {isLoading ?
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('@/assets/images/star.png')} style={styles.imageMini} />
                                <ThemedText color={colors.gray}> Premium account</ThemedText>
                            </View>
                        :
                            <View style={{ marginTop: 10 }}>
                                <Skeleton colorMode="light" width={150} height={20} />
                            </View>
                        }
                        </View>
                </View>
            </View>
            <Image source={require('@/assets/images/backgroundBlack.jpg')} style={styles.imageBackground}/>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                    <View style={stylesModal.modalBackground}>
                        <View style={[stylesModal.modalContainer, {backgroundColor: colors.grayPress}]}>
                            <Text style={stylesModal.modalHeader}>Notifications</Text>
                            <Text style={stylesModal.modalText}>You don't have notifications at the moment.</Text>
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
        borderBottomEndRadius: 35,
        borderBottomStartRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
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
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1000,
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
        color: '#333',
    },
})