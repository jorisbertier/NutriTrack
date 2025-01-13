import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Row from './Row';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

export default function StopWatch({selectedChallenge, email }: any) {

        const [time, setTime] = useState(0);
        const [running, setRunning] = useState(false);
        const intervalRef = useRef(null);
        const startTimeRef = useRef(0);
        const {colors} = useTheme();
        const auth = getAuth();
        const user = auth.currentUser;
        const uid = user?.uid;
        console.log('user', uid)
        
        const STORAGE_KEY = `StopWatch_State${uid}`;

        // useEffect(() => {
        //     if(email) {
        //         console.log('Email:', email);
        //         // console.log('Selected Challenge ID:', selectedChallenge?.id);
        //         console.log('Generated Storage Key:', STORAGE_KEY);

        //     }
        // }, [email, selectedChallenge])

        const formatedTime = (seconds: number) => {
            const months = Math.floor(seconds / (30 * 24 * 3600));
            const days = Math.floor((seconds % (30 * 24 * 3600)) / (24 * 3600));
            const hours = Math.floor((seconds % (24 * 3600)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${months > 0 ? `${months} m ` : ''}${days > 0 ? `${days} d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}min ` : ''}${remainingSeconds}s`;
        }

        const saveState = async () => {
            try {
                const state = {
                    time,
                    running,
                    lastStart: running ? Date.now() : null, // Save timestamp if running
                    uid,
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (error) {
            console.error('Failed to save state:', error);
            }
        };
        const loadState = async () => {
            try {
            const savedState = await AsyncStorage.getItem(STORAGE_KEY);
            // console.log('savedstate', savedState)
            // console.log('storagekey', STORAGE_KEY)
            if (savedState) {
                const { time: savedTime, running: wasRunning, lastStart, uid: savedUid} = JSON.parse(savedState);

                if (savedUid !== uid) {
                    console.warn('Uid mismatch. State will not be loaded.');
                    return;
                }

                if (wasRunning) {
                    const elapsed = Math.floor((Date.now() - lastStart) / 1000);
                    setTime(savedTime + elapsed);
                    startStopwatch(savedTime + elapsed);
                } else {
                    setTime(savedTime);
                }
            }
            } catch (error) {
                console.error('Failed to load state:', error);
            }
        };
        // Function to start the stopwatch
        const startStopwatch = (initialTime = time) => {
            initialTime = isNaN(initialTime) ? 0 : initialTime; 
            startTimeRef.current = Date.now() - initialTime * 1000;
            intervalRef.current = setInterval(() => {
                setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
            setRunning(true);
        };
        // Function to pause the stopwatch
        const pauseStopwatch = () => {
            clearInterval(intervalRef.current);
            setRunning(false);
            saveState();
        };
    
        // Fonction pour réinitialiser le chronomètre
        const resetStopwatch = () => {
            clearInterval(intervalRef.current);
            setTime(0);
            setRunning(false);
            saveState();
        };
    
        // Fonction pour reprendre le chronomètre
        const resumeStopwatch = () => {
            startStopwatch();
        };

        useEffect(() => {
            loadState();
            return () => clearInterval(intervalRef.current); // Nettoyer l'intervalle à la fin
        }, []);
    
        // Sauvegarder l'état à chaque changement de `time` ou `running`
        useEffect(() => {
            saveState();
        }, [time, running]);
        
    
        return (
            <View style={styles.container}>
                <Image source={selectedChallenge?.source || require('@/assets/images/challenge/sugar.jpg')} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', borderRadius: 30, opacity: 0.3}}/>
                <Row style={styles.row}>
                <View style={[styles.clock, { backgroundColor: colors.primary }]}>
                <Image source={require('@/assets/images/challenge/clock.png')} style={styles.image} />
                </View>
                <View style={{ backgroundColor: colors.morphism, padding: 10, borderRadius: 10 }}>
                {running ? (
                    <ThemedText variant="title3" color={colors.whiteFix}>
                    Challenge in progress
                    </ThemedText>
                ) : (
                    <ThemedText variant="title3" color={colors.whiteFix}>
                    Start the challenge
                    </ThemedText>
                )}
                </View>
            </Row>
            <Row style={styles.buttonContainer}>
                <Text style={styles.timeText}>{formatedTime(time)}</Text>
                {running ? (
                <TouchableOpacity onPress={resetStopwatch}>
                    <View style={{ alignItems: 'center' }}>
                    <Image source={require('@/assets/images/endwork.png')} style={styles.image2} />
                    <ThemedText color={colors.grayDark}>End challenge</ThemedText>
                    </View>
                </TouchableOpacity>
                ) : (
                <>
                    <TouchableOpacity
                    style={[styles.button, styles.startButton, { backgroundColor: colors.primary }]}
                    onPress={startStopwatch}
                    >
                    <Text style={styles.buttonText}>Start</Text>
                    </TouchableOpacity>
                </>
                )}
                {!running && (
                <TouchableOpacity style={[styles.button, styles.resumeButton]} onPress={resumeStopwatch}>
                    <Text style={styles.buttonText}>Resume</Text>
                </TouchableOpacity>
                )}
            </Row>
            </View>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 30,
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,

        },
        header: {
            fontSize: 30,
            color: "green",
            marginBottom: 10,
        },
        row : {
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            width: '80%',
        },
        clock: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: 15,
            height: 15,
        },
        image2: {
            width: 25,
            height: 25,
        },
        subHeader: {
            fontSize: 18,
            marginBottom: 10,
            color: "blue",
        },
        timeText: {
            fontSize: 20,
            color: 'white'
        },
        buttonContainer: {
            flexDirection: 'row',
            width: '80%',
            paddingVertical: 10,
            justifyContent: 'space-between',
            marginTop: 20,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
        },
        startButton: {
            marginRight: 10,
        },
        resetButton: {
            backgroundColor: '#e74c3c',
            marginRight: 10,
        },
        resumeButton: {
            backgroundColor: '#3498db',
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
        },
    });
    