import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Skeleton } from 'moti/skeleton';
import { colorMode } from '@/constants/Colors';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const percentage = (progress / quantityGoal) * 100;

    return (
        <View style={styles.container}>
            {isLoading ?
                <View style={[styles.progressBar1, {backgroundColor: colors.gray}]}>
                <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={['#A9B8E3', '#8592F2', '#5B6FD2']}
                        style={[
                            styles.progressBar2,
                            { width: `${Math.min(percentage, 100)}%` },
                        ]}
                    />
                {progress < quantityGoal ? (
                    <ThemedText variant="title2" color={colors.black} style={styles.textProgress}>{t('work')} ...</ThemedText>
                ) : (
                    <ThemedText variant="title2" color={colors.black} style={styles.textProgress}>{t('workDone')} !</ThemedText>
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
        height: 12
    },
    progressBar2: {
        height: 12,
        borderRadius: 7,
    },
    text : {
        textAlign: 'center',
        marginVertical: 10
    },
    textProgress : {
        // position: 'absolute',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        top: 12,
        left: 20,
        height: 20
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
      },
});