import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const SuccessStep = () => {

    const navigation = useNavigation();

    const confettiRef = useRef<LottieView>(null);
    const successRef = useRef<LottieView>(null);

    const handleGoToHome = () => {
        navigation.navigate('home')
    }
    
    useEffect(() => {
        successRef.current?.play();

        const start = setTimeout(() => {
            confettiRef.current?.play();
        }, 3000)

        const delay = setInterval(() => {
            confettiRef.current?.play();
        }, 10000)

        return () => {
        clearTimeout(start);
        clearInterval(delay);
    };
    }, [])
    return (
        <View style={styles.container}>
            <LottieView
                ref={successRef}
                source={require('@/assets/lottie/success.json')}
                loop={false}
                style={{ width: 200, height: 200 }}
            />
            <Text style={styles.text}>Bienvenue parmi nous !</Text>
            <Text style={styles.subtext}>
                Ton aventure nutrition commence à partir d'aujourd'hui.{"\n"}{"\n"}Nous t'accompagnerons à réaliser tes objectifs quotidiennement !
            </Text>
            <TouchableOpacity onPress={handleGoToHome}>
                <Text style={styles.button}>Accéder à votre tableau de bord</Text>
            </TouchableOpacity>
            <View style={styles.confetti}>
                <LottieView
                    ref={confettiRef}
                    source={require('@/assets/lottie/Confetti.json')}
                    loop={false}
                    style={{ width: "100%", height: 300, top: -200 }}
                />
            </View>
        </View>
    );
};

export default SuccessStep;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 100,
        position: 'relative',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
        color: 'black',
    },
    subtext: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        color: 'gray',
    },
    button: {
        marginTop: 30,
        backgroundColor: 'black',
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    confetti: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});