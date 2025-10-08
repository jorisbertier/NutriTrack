import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface BadgeProps {
    name: string;
    level: number;
    progress: number; // Valeur entre 0 et 100 pour le pourcentage
    maxProgress?: number; // Optionnel, max pour normaliser la progression
}

const Badge: React.FC<BadgeProps> = ({ name, level, progress, maxProgress = 100 }) => {
    // Normalise la progression en pourcentage (0 à 100)
    const normalizedProgress = maxProgress ? (progress / maxProgress) * 100 : progress;
    const progressWidth = Math.min(Math.max(normalizedProgress, 0), 100); // Limite entre 0 et 100

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/achievments/badge-removebg-preview.png')}
                style={styles.badgeImage}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.badgeName}>{name}</Text>
                <Text style={styles.badgeDescription}>Earn 10000 calories</Text>

                {/* Barre + texte sur la même ligne */}
                <View style={styles.progressRow}>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${progressWidth}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        {Math.round(progress)} / {maxProgress}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        gap: 20,
        height: 150,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
    badgeImage: {
        height: 100,
        width: 100,
        borderRadius: 30,
    },
    infoContainer: {
        flexDirection: 'column',
        gap: 10,
        justifyContent: 'flex-end',
        width: '50%',
    },
    badgeName: {
        fontWeight: 800,
        fontSize: 20,
    },
    badgeDescription: {
        fontSize: 14,
        color: '#666',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    progressContainer: {
        flex: 1,
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        minWidth: 50,
        textAlign: 'right',
    },
});

export default Badge;
