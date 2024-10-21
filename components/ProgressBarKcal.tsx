import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

type ProgressBarProps = {
    progress: number;
    nutri: string;
    quantityGoal: number;
    color?: string;
    height?: number;
};

const { height } = Dimensions.get('window');

export const ProgressBarKcal: React.FC<ProgressBarProps> = ({ progress, nutri, quantityGoal, color = '#F97216', height = 40 }) => {

    const percentage = (progress / quantityGoal) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.progressBar1}>
            <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    colors={['#A9B8E3', '#8592F2', '#5B6FD2']} // Dégradé de l'orange clair au orange
                    style={[
                        styles.progressBar2,
                        { width: `${Math.min(percentage, 100)}%`, height },
                    ]}
                />
            {progress < quantityGoal ? (
                <ThemedText variant="title2" color="white" style={styles.textProgress}>Work in progress</ThemedText>
            ) : (
                <ThemedText variant="title2" color="white" style={styles.textProgress}>Work done !</ThemedText>
            )}
            </View>
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
  <Text style={styles.buttonText}>
    Sign in with Facebook
  </Text>
</LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 3
    },
    progressBar1: {
        position: 'relative',
        width: '95%',
        backgroundColor: '#E0E0E0',
        borderRadius: 7,
        overflow: 'visible',
        height: 40
    },
    progressBar2: {
        height: '95%',
        borderRadius: 5,
    },
    text : {
        textAlign: 'center',
        marginVertical: 10
    },
    textProgress : {
        position: 'absolute',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        top: 12,
        left: 20
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
      },
      buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
      },
});