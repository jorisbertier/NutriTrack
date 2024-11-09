import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';
import { useTheme } from '@/hooks/ThemeProvider';

type ProgressBarProps = {
    progress: number;
    nutri: string;
    quantityGoal: number;
    color?: string;
    height?: number;
    isLoading: boolean
};
export const ProgressBarKcal: React.FC<ProgressBarProps> = ({isLoading, progress, nutri, quantityGoal, color = '#F97216', height = 40 }) => {

    const { colors } = useTheme();
    const percentage = (progress / quantityGoal) * 100;

    return (
        <View style={styles.container}>
            {isLoading ?
                <View style={[styles.progressBar1, {backgroundColor: colors.grayMode}]}>
                <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={['#A9B8E3', '#8592F2', '#5B6FD2']}
                        style={[
                            styles.progressBar2,
                            { width: `${Math.min(percentage, 100)}%`, height },
                        ]}
                    />
                {progress < quantityGoal ? (
                    <ThemedText variant="title2" color={colors.black} style={styles.textProgress}>Work in progress</ThemedText>
                ) : (
                    <ThemedText variant="title2" color={colors.black} style={styles.textProgress}>Work done !</ThemedText>
                )}
                </View>
            :
                <Skeleton colorMode={colorMode} width={'95%'} height={40}/>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 3,
    },
    progressBar1: {
        position: 'relative',
        width: '100%',
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
});