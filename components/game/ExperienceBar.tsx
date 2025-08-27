import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';

interface ExperienceBarProps {
    level: number;
    title: string;
    currentXP: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ level, title, currentXP }) => {

    const { colors} = useTheme();
    const { t, i18n } = useTranslation();

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
    const titleLevelFR: Record<number, string> = {
        1: 'Débutant pancake',
        2: 'Zesteur de citron',
        3: 'Gladiateur de l’ail',
        4: 'Tueur de céréales',
        5: 'Sorcier de la cuillère',
        6: 'Ninja de l’avocat',
        7: 'Guru de la banane',
        8: 'Dieu de la salade',
        9: 'Divinité des protéines',
        10: 'Senseï du tofu',
    }

    const titleLevelES: Record<number, string> = {
        1: 'Principiante de pancakes',
        2: 'Rallador de limón',
        3: 'Gladiador del ajo',
        4: 'Asesino de cereales',
        5: 'Mago de la cuchara',
        6: 'Ninja del aguacate',
        7: 'Guru del plátano',
        8: 'Dios de la ensalada',
        9: 'Divinidad de las proteínas',
        10: 'Senseï del tofu',
    }

    let titles: Record<number, string>;
        switch (i18n.language) {
            case 'fr':
                titles = titleLevelFR;
                break;
            case 'es':
                titles = titleLevelES;
                break;
            default:
                titles = titleLevel;
        }
        
    return (
        <View style={styles.container}>
            <ThemedText variant="title3" color={colors.grayPress} style={styles.levelText}>{titles[safeLevel]} </ThemedText>
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