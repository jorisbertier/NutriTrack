import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';

type Goal = 'lose' | 'maintain' | 'gain';

type GoalToggleProps = {
    selectedGoal: Goal | null;
    onSelect: (goal: Goal) => void;
};

const GoalToggle: React.FC<GoalToggleProps> = ({ selectedGoal, onSelect }) => {

    const { colors } = useTheme();
    const { t } = useTranslation();

    const goals: { label: string; value: Goal }[] = [
        { label: t('lose'), value: 'lose' },
        { label: t('maintain'), value: 'maintain' },
        { label: t('gain'), value: 'gain' },
    ];

    return (
        <>
            <Text style={{width: '90%', textAlign: 'center', fontSize: 16, fontWeight: 500, marginTop: 20}}>{t('titleEdit')}</Text>
        <View style={[styles.container]}>
        {goals.map(({ label, value }) => {
            const isSelected = selectedGoal === value;
            return (
            <TouchableOpacity
                key={value}
                onPress={() => onSelect(value)}
                style={[
                styles.button,
                {
                    backgroundColor: isSelected ? colors.blueLight : colors.gray,
                    borderColor: isSelected ? colors.blueLight : colors.gray,
                },
                ]}
                activeOpacity={0.8}
            >
                <Text
                style={[
                    styles.text,
                    { color: isSelected ? colors.black : colors.grayDark },
                ]}
                >
                {label}
                </Text>
            </TouchableOpacity>
            );
        })}
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        width: '90%',
        margin: 'auto'
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 15,
        borderRadius: 20,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
});

export default GoalToggle;
