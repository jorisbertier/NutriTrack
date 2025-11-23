import { Image, StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { ThemedText } from "./ThemedText";
import { capitalizeFirstLetter, fetchUserDataConnected, getIdAvatarProfile } from "@/functions/function";
import Row from "./Row";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/hooks/ThemeProvider";
import ExperienceBar from "./game/ExperienceBar";
import { User } from "@/interface/User";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchUserData } from "@/redux/userSlice";
import { useTranslation } from "react-i18next";
import Rive, { RiveRef } from "rive-react-native";
import { useRiveRestore } from "@/hooks/useRiveSelections";

type Props = {
    name: string;
    isLoading: boolean,
    profilePictureId: number,
    isPremium: boolean
}

export default function Banner({name, isLoading, profilePictureId, isPremium}: Props) {

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const dispatch = useDispatch()
    const userRedux = useSelector((state: RootState) => state.user.user);
    const { i18n } = useTranslation();

    const getMonthShort = (date: Date) => {
        let locale = 'en-US';
        if (i18n.language === 'fr') locale = 'fr-FR';
        else if (i18n.language === 'es') locale = 'es-ES';

        const month = date.toLocaleString(locale, { month: 'long' });
        // Optionnel : capitaliser la première lettre
        return month.charAt(0).toUpperCase() + month.slice(1);
    };

    const monthLabel = getMonthShort(new Date());

    useEffect(() => {
        if (userRedux) {
            // dispatch(fetchUserData(currentUser.email));
            console.log("XP de l'utilisateur depuis Redux :", userRedux.xp);
        }
    }, [userRedux]);

    useEffect(() => {
        fetchUserDataConnected(user, setUserData)
        dispatch(fetchUserData(user.email));
    }, [])

    const avatar = getIdAvatarProfile(profilePictureId)

    const date = new Date();
    const {colors, toggleTheme, theme} = useTheme();
    const colorMode: 'light' | 'dark' = 'light';
    const greetings = ['Hi','こんにちは','Hola', 'Bonjour' ];
    const { t } = useTranslation(); 

    const [currentGreeting, setCurrentGreeting] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    /**RIVE SETUP*/
    const riveRef = useRef<RiveRef>(null);
    //@ts-ignore
    useRiveRestore(riveRef);
    
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
                        <Image source={require('@/assets/images/calendar.png')} style={[styles.imageMini, { tintColor: "white" }]} />

                        <ThemedText color={colors.gray} style={{fontSize: 15, fontWeight: 800}}>{capitalizeFirstLetter(monthLabel)} {date.getDate()},  {date.getFullYear()}</ThemedText>
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
                </Row>
                <View style={{flexDirection: 'row', gap: 20, justifyContent: 'flex-start', width: '90%', marginBottom: -50}}>
                    <Skeleton colorMode={colorMode} width={60} height={60} radius={'round'}>
                        {isLoading ?
                            // <Image source={avatar} style={styles.imageProfil} />
                            <View style={{backgroundColor: colors.white, overflow: "hidden", borderRadius: "50%",justifyContent: 'center', alignItems: 'center', height: 90, width: 90, marginTop: -8}}>
                                <Rive
                                    ref={riveRef}
                                    source={require("../assets/rive/panda_neutral (25).riv")}
                                    autoplay={true}
                                    style={{ width: 130, height: 130, marginTop: 30 }}
                                />
                            </View>
                        : null}
                    </Skeleton>
                        <View style={{flexDirection: 'column'}}>
                        {isLoading ? 
                            <Text style={{color: 'white', fontSize: 28, maxWidth: 280, fontWeight: 800, letterSpacing: 2, flexWrap: 'wrap'}}>{greetings[currentGreeting]}, {name}!</Text>
                        :
                        <Skeleton colorMode={colorMode} width={200} height={30} />
                        }
                        {isLoading ?
                            <View style={{flexDirection: 'row', gap: 5, alignItems: 'flex-start'}}>
                                {isPremium ? (
                                    <>
                                        <Image source={require('@/assets/images/icon/crown.png')} style={[styles.imageMini, { tintColor: "#FFD700"}]} />
                                        <ThemedText color={colors.gray}>{t('premiumAccount')}</ThemedText>
                                    </>
                                ): (
                                    <>
                                        <Image source={require('@/assets/images/star.png')} style={styles.imageMini} />
                                        <ThemedText color={colors.gray}>{t('freeAccount')}</ThemedText>
                                    </>
                                )}
                            </View>
                        :
                            <View style={{ marginTop: 10 }}>
                                <Skeleton colorMode="light" width={150} height={10} />
                            </View>
                        }
                        </View>
                </View>
            <Row style={{marginTop: 30}}>
                {isLoading ?
                <View style={{ width: '100%'}}>
                    {/* <ExperienceBar level={userRedux?.level} title={'Apprenti gourmet'} currentXP={userData[0]?.xp}/> */}
                    
                    <ExperienceBar level={Number(userRedux?.level)} title={'Apprenti gourmet'} currentXP={Number(userRedux?.xp)} levelSecure={userData[0]?.level} currentXpSecure={userData[0]?.xp}/>
                </View>
                :
                    <View style={{ marginTop: 20, marginBottom: -30, alignItems: 'center' }}>
                        <Skeleton colorMode="light" width={'95%'} height={48} />
                    </View>
                }
            </Row>
            </View>
            <Image source={require('@/assets/images/backgroundBlack.jpg')} style={styles.imageBackground}/>
            {/* <Modal
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
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={stylesModal.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal> */}
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