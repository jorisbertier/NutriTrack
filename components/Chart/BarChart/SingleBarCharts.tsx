import { useTheme } from '@/hooks/ThemeProvider';
import { format } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {useAnimatedStyle,withTiming} from 'react-native-reanimated';

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
    const { colors } = useTheme()

    const rStyle = useAnimatedStyle(() => {
        return {
        height: withTiming(maxHeight * normalizedValue),
        opacity: withTiming(normalizedValue),
        };
    }, [normalizedValue, maxHeight]);

    return (
        <View>
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
            {format(day.day, 'eeeeee')}
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
        top: -20,
        width: 40,
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