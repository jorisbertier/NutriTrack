import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SuccessStep = () => {

    const confettiRef = useRef<LottieView>(null);
    const successRef = useRef<LottieView>(null);
    
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
            <View style={styles.confetti}>
                <LottieView
                    ref={confettiRef}
                    source={require('@/assets/lottie/Confetti.json')}
                    loop={false}
                    style={{ width: "100%", height: 300, top: -150 }}
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
        marginTop: 50,
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