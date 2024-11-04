import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';

export default function StopWatch() {
    
        // State and refs to manage time and stopwatch status
        const [time, setTime] = useState(0);
        const [running, setRunning] = useState(false);
        const intervalRef = useRef(null);
        const startTimeRef = useRef(0);
        // Function to start the stopwatch
        const startStopwatch = () => {
            startTimeRef.current = Date.now() - time * 1000;
            intervalRef.current = setInterval(() => {
                setTime(Math.floor((Date.now() - 
                startTimeRef.current) / 1000));
            }, 1000);
            setRunning(true);
        };
        // Function to pause the stopwatch
        const pauseStopwatch = () => {
            clearInterval(intervalRef.current);
            setRunning(false);
        };
        // Function to reset the stopwatch
        const resetStopwatch = () => {
            clearInterval(intervalRef.current);
            setTime(0);
            setRunning(false);
        };
        // Function to resume the stopwatch
        const resumeStopwatch = () => {
            startTimeRef.current = Date.now() - time * 1000;
            intervalRef.current = setInterval(() => {
                setTime(Math.floor(
                    (Date.now() - startTimeRef.current) / 1000));
            }, 1000);
            setRunning(true);
        };
    
        return (
            <View style={styles.container}>
                <Text style={styles.header}>
                    Geeksforgeeks
                </Text>
                <Text style={styles.subHeader}>
                    Stop Watch In Native
                </Text>
                <Text style={styles.timeText}>{time}s</Text>
                <View style={styles.buttonContainer}>
                    {running ? (
                        <TouchableOpacity
                            style={[styles.button, styles.pauseButton]}
                            onPress={pauseStopwatch}
                        >
                            <Text style={styles.buttonText}>Pause</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={[styles.button, styles.startButton]}
                                onPress={startStopwatch}
                            >
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.resetButton]}
                                onPress={resetStopwatch}
                            >
                                <Text style={styles.buttonText}>
                                    Reset
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {!running && (
                        <TouchableOpacity
                            style={[styles.button, styles.resumeButton]}
                            onPress={resumeStopwatch}
                        >
                            <Text style={styles.buttonText}>
                                Resume
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            fontSize: 30,
            color: "green",
            marginBottom: 10,
        },
        subHeader: {
            fontSize: 18,
            marginBottom: 10,
            color: "blue",
        },
        timeText: {
            fontSize: 48,
        },
        buttonContainer: {
            flexDirection: 'row',
            marginTop: 20,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
        },
        startButton: {
            backgroundColor: '#2ecc71',
            marginRight: 10,
        },
        resetButton: {
            backgroundColor: '#e74c3c',
            marginRight: 10,
        },
        pauseButton: {
            backgroundColor: '#f39c12',
        },
        resumeButton: {
            backgroundColor: '#3498db',
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
        },
    });
    