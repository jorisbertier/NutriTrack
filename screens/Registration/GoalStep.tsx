import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import { t } from 'i18next';

type Goal = {
    goal: string;
    setGoal: (value: string) => void;
    goalError: string;
}

const GoalStep = ({
    goal,
    setGoal,
    goalError,
}: Goal) => {

    const {colors} = useTheme();
    console.log(goal)

    return (
    <>
    <Text style={[styles.label, { color: colors.black, marginTop: 20 }]}>{t('goalTitle')}</Text>
    <TouchableOpacity
        style={[styles.goal, { backgroundColor: goal === "loss" ? colors.blueLight : colors.whiteFix, borderColor: goal === "loss" ? colors.blackFix : colors.grayDarkFix}]}
        onPress={() => setGoal('loss')} 
    >
        <View style={styles.text}>
        <Text>➖</Text>
        <Text>{t('loseRegistration')}</Text>

        </View>
        <View style={[styles.circle, { backgroundColor: goal === "loss" ? colors.blackFix : colors.whiteFix}]}>
            {goal === "loss" && <Image style={styles.image} source={require('@/assets/images/icon/check-light.png')}/>}
        </View>
    </TouchableOpacity>
    <TouchableOpacity
        style={[styles.goal, { backgroundColor: goal === "maintain" ? colors.blueLight : colors.whiteFix, borderColor: goal === "maintain" ? colors.blackFix : colors.grayDarkFix}]}
        onPress={() => setGoal('maintain')} 
    >   
        <View style={styles.text}>
            <Text>⚖️</Text>
            <Text>{t('maintainRegistration')}</Text>
        </View>
        <View style={[styles.circle, { backgroundColor: goal === "maintain" ? colors.blackFix : colors.whiteFix}]}>
            {goal === "maintain" && <Image style={styles.image} source={require('@/assets/images/icon/check-light.png')}/>}
        </View>
    </TouchableOpacity>
    <TouchableOpacity
        style={[styles.goal, { backgroundColor: goal === "gain" ? colors.blueLight : colors.whiteFix, borderColor: goal === "gain" ? colors.blackFix : colors.grayDarkFix}]}
        onPress={() => setGoal('gain')} 
    >
        <View style={styles.text}>
            <Text>➕</Text>
            <Text>{t('gainRegistration')}</Text>
        </View>
        <View style={[styles.circle, { backgroundColor: goal === "gain" ? colors.blackFix : colors.whiteFix}]}>
            {goal === "gain" && <Image style={styles.image} source={require('@/assets/images/icon/check-light.png')}/>}
        </View>
    </TouchableOpacity>
    {goalError && <Text style={styles.errorText}>{goalError}</Text>}
    </>
    )
}

const styles = StyleSheet.create({
        label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    circle : {
        height: 20,
        width: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    goal : {
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center',
        paddingHorizontal: 20,
    },
    image: {
        height: 15,
        width: 15,
    },
    text: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    errorText: {
        color: 'red',
        marginTop: -5,
        marginBottom: 10
    },
})

export default GoalStep;
