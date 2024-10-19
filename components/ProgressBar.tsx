import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { Dimensions } from 'react-native';
import Row from './Row';

type ProgressBarProps = {
    progress: number;
    nutri: string;
    quantityGoal: number;
    color?: string;
    height?: number;
};

const { height } = Dimensions.get('window');

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, nutri, quantityGoal, color = '#CBD77E', height = 40 }) => {

    const percentage = (progress / quantityGoal) * 100;

    return (
        <View style={styles.container}>
            <Row style={{justifyContent: 'space-between', width: '99%'}}>
                <ThemedText variant="title2" style={styles.text}>
                    Your {nutri} goal today</ThemedText>
                <ThemedText variant="title3">{progress} / {quantityGoal} g</ThemedText>
            </Row>
            <View style={styles.progressBar1}>
                <View
                    style={[
                        styles.progressBar2,
                        { width: `${Math.min(percentage, 100)}%`, backgroundColor: color, height },
                    ]}
                />
            {progress < quantityGoal ? (
                <ThemedText variant="title2" color="white" style={styles.textProgress}>Work in progress</ThemedText>
            ) : (
                <ThemedText variant="title2" color="white" style={styles.textProgress}>Work done !</ThemedText>
            )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        height: 100,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginVertical: 3
    },
    progressBar1: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 7,
        overflow: 'hidden',
        height: 40
    },
    progressBar2: {
        height: '100%',
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
    }
});

export default ProgressBar;