import { format } from 'date-fns';
import { ScrollView,StyleSheet,Text,useWindowDimensions,View } from 'react-native';

import { SingleBarChart, type Day } from './SingleBarCharts';
import { useTheme } from '@/hooks/ThemeProvider';

type Week = Day[];

type WeeklyBarChartProps = {
    weeks: Week[];
    activeWeekIndex: number;
    onWeekChange: (index: number) => void;
};

export const WeeklyBarChart = ({weeks,activeWeekIndex,onWeekChange,}: WeeklyBarChartProps) => {

    const { width: windowWidth } = useWindowDimensions();
    const activeWeek = weeks[activeWeekIndex];
    const { colors } = useTheme()

    const BarChartWidth = windowWidth * 0.8;
    const BarChartGap = 10;
    const BarWidth = (BarChartWidth - BarChartGap * (activeWeek.length - 1)) / activeWeek.length;
    const MaxBarHeight = 150;
    const ScrollViewHeight = 60;

    return (
        <View
        style={{height: ScrollViewHeight + MaxBarHeight, width: windowWidth}}>

        <View
            style={{
                height: MaxBarHeight,
                flexDirection: 'row',
                gap: BarChartGap,
                alignItems: 'flex-end',
                marginHorizontal: (windowWidth - BarChartWidth) / 2,
            }}>
            {activeWeek.map((day, index) => (
            <SingleBarChart
                key={index}
                maxHeight={MaxBarHeight}
                width={BarWidth}
                day={day}
            />
            ))}
        </View>
        <ScrollView
            horizontal
            snapToInterval={windowWidth}
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            disableIntervalMomentum
            scrollEventThrottle={16} 
            onScroll={({ nativeEvent }) => {
                const scrollOffset = nativeEvent.contentOffset.x;
                const activeIndex = Math.round(scrollOffset / windowWidth);
                onWeekChange(activeIndex);
            }}
            style={{
                width: windowWidth,
                height: ScrollViewHeight,
            }}>
            {weeks.map((week, index) => {
            return (
                <View
                key={index}
                style={{
                    height: ScrollViewHeight,
                    width: windowWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text style={[styles.label, {color: colors.black}]}>
                    Week of {format(week[0].day, 'd MMMM')}
                </Text>
                </View>
            );
            })}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontFamily: 'FiraCode-Regular',
        
    },
});