import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '@/hooks/ThemeProvider';

interface ExperienceBarProps {
    level: number;
    title: string;
    currentXP: number;
    maxXP: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ level, title, currentXP, maxXP }) => {

    const { colors} = useTheme();
    const progress = Math.min((currentXP / maxXP) * 100, 100); // Limiter à 100%

    return (
        <View style={styles.container}>
            <ThemedText variant="title3" color={colors.grayPress} style={styles.levelText}> {title}</ThemedText>
            <View style={styles.barBackground}>
                <View style={[styles.barProgress, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.xpText}>lvl {level} : {currentXP} / {maxXP} XP</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginVertical: 0,
        marginTop: 20,
        marginBottom: -30
    },
    levelText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 3,
    },
    barBackground: {
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    barProgress: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    xpText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        color: '#757575',
    },
});

export default ExperienceBar;