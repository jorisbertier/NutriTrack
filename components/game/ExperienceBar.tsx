import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '@/hooks/ThemeProvider';

interface ExperienceBarProps {
    level: number;
    title: string;
    currentXP: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ level, title, currentXP }) => {

    const { colors} = useTheme();
    const safeLevel = isNaN(level) ? 1 : level;
    const safeXp = isNaN(currentXP) ? 0 : currentXP;

    let levelXP = 0;
    let i = 1;

    for(i= 1; i <= 1; i++) {
        levelXP = 20;
        for(i = 1; i < level; i++) {
            levelXP *= 2;
        }
    }

    let xpTotalForLevel = levelXP / 2;
    let xpBeginForLevel = safeXp - xpTotalForLevel;

    if(safeLevel === 1) {

        xpBeginForLevel = 0;
        xpTotalForLevel = 20;
    }
    const progress = Math.min((xpBeginForLevel / xpTotalForLevel) * 100, 100); // Limit a 100%


    const titleLevel: Record<number, string> = {
        1: 'Pancake rookie',
        2: 'Lemon Zester',
        3: 'Garlic gladiator',
        4: 'Cereal Killer',
        5: 'Spoon Wizard',
        6: 'Avocado ninja',
        7: 'Guru of banana',
        8: 'God of salad',
        9: 'Divinity of proteins',
        10: 'Tofu Senseï',
    }
    
    return (
        <View style={styles.container}>
            <ThemedText variant="title3" color={colors.grayPress} style={styles.levelText}>{titleLevel[safeLevel]} </ThemedText>
            <View style={styles.barBackground}>
                <View style={[styles.barProgress, { width: `${progress}%`, backgroundColor: colors.primary}]} />
            </View>
            <Text style={styles.xpText}>lvl {safeLevel} : {xpBeginForLevel} / {xpTotalForLevel} xp</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginVertical: 0,
        marginTop: 20,
        marginBottom: -30,
        margin: "auto"
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
    },
    xpText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        color: '#757575',
    },
});

export default ExperienceBar;