import { addDays, format, startOfWeek } from 'date-fns';
import { ScrollView,StyleSheet,Text,useWindowDimensions,View } from 'react-native';

import { SingleBarChart, type Day } from './SingleBarCharts';
import { useTheme } from '@/hooks/ThemeProvider';
import { Image } from 'react-native';

type Week = Day[];

type WeeklyBarChartProps = {
    weeks: Week[];
    activeWeekIndex: number;
    onWeekChange: (index: number) => void;
};

export const WeeklyBarChart = ({weeks , activeWeekIndex , onWeekChange,}: WeeklyBarChartProps) => {

    const { width: windowWidth } = useWindowDimensions();
    const activeWeek = weeks[activeWeekIndex];
    const { colors } = useTheme()

    const BarChartWidth = windowWidth * 0.8;
    const BarChartGap = 10;
    const BarWidth = (BarChartWidth - BarChartGap * (activeWeek.length - 1)) / activeWeek.length;
    const MaxBarHeight = 150;
    const ScrollViewHeight = 60;
    console.log(activeWeekIndex)

    const getDaynumber = (date: string) => {
        // Vérifier si la date est déjà un objet Date, sinon la convertir
        const parsedDate = new Date(date);  // Si la date est déjà une chaîne ISO, elle sera automatiquement convertie
        // console.log('Parsed Date:', parsedDate);
    
        // Utiliser startOfWeek pour obtenir le premier jour de la semaine
        const weekStart = startOfWeek(parsedDate, { weekStartsOn: 1 }); // 1 pour lundi comme premier jour de la semaine
        // console.log('Week Start:', weekStart);
    
        // Ajouter 7 jours pour corriger visuellement le décalage d'une semaine
        const adjustedWeekStart = addDays(weekStart, 7);
        // console.log('Adjusted Week Start:', adjustedWeekStart);
    
        // Formater la date du premier jour de la semaine ajustée
        const formattedDate = format(adjustedWeekStart, 'd MMMM yyyy'); // Exemple : 13 janvier 2025
        
        return formattedDate;
    };

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
                    <View style={{flexDirection: "row", position: 'relative',alignItems: 'center'}}>
                        {activeWeekIndex !== 0 && (
                            <Image source={require('@/assets/images/arrow-right.png')} style={{tintColor: 'black',transform: [{ scaleX: -1 }], position: 'absolute', width: 15, height: 15, left: -50}} />
                        )}
                        <Text style={[styles.label, {color: colors.black}]}>
                            
                            Week of {getDaynumber(String(week[0]?.day) ?? '')}
                        </Text>
                        {activeWeekIndex !== 2 && (
                            <Image source={require('@/assets/images/arrow-right.png')} style={{tintColor: 'black', position: 'absolute', width: 15, height: 15, right: -50}} />
                        )}
                    </View>
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