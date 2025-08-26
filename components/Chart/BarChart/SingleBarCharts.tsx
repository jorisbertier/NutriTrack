import { useTheme } from '@/hooks/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {useAnimatedStyle,withTiming} from 'react-native-reanimated';
import { fr, es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export type Day = {
    day: Date;
    value: number; // 0 - 1
};

type SingleBarChartProps = {
    maxHeight: number;
    width: number;
    day: Day;
};

export const SingleBarChart = ({ maxHeight , width , day }: SingleBarChartProps) => {

    const normalizedValue = Math.min(day.value / 3000, 1);
    const { colors } = useTheme();

    const { i18n } = useTranslation();

    const rStyle = useAnimatedStyle(() => {
        return {
        height: withTiming(maxHeight * normalizedValue),
        opacity: withTiming(normalizedValue),
        };
    }, [normalizedValue, maxHeight]);

    const getDayInitial = (date: Date) => {
        const weekdaysFR = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
        const weekdaysES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
        const weekdaysEN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

        let weekdays;
        switch (i18n.language) {
            case 'fr': weekdays = weekdaysFR; break;
            case 'es': weekdays = weekdaysES; break;
            default: weekdays = weekdaysEN; break;
        }

        const dayIndex = new Date(date).getDay();
        return weekdays[dayIndex];
    };

    return (
        <View style={{ paddingTop: 20}}>
            <Text style={[styles.valueText, { color: colors.black}]}>{(day.value).toFixed(0)}</Text>
        <Animated.View
            style={[
            {
                width: width,
                backgroundColor: colors.primaryChart,
                borderRadius: 15,
                borderCurve: 'continuous',
            },
            rStyle,
            ]}
        />
        <Text
            style={{
            width: width,
            textAlign: 'center',
            fontSize: 12,
            marginTop: 5,
            color: colors.black,
            fontFamily: 'FiraCode-Regular',
            textTransform: 'lowercase',
            }}
        >
            {getDayInitial(day.day)}
        </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    valueText: {
        fontSize: 10,
        fontFamily: 'FiraCode-Regular',
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        width: 40,
        zIndex: 10
    },
    dayLabel: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        marginTop: 5,
        fontFamily: 'FiraCode-Regular',
        textTransform: 'lowercase',
    },
});