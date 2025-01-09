import CalorieBarChart from "@/components/Chart/Polar";
import { WeeklyBarChart } from "@/components/Chart/BarChart";
import { useTheme } from "@/hooks/ThemeProvider";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    PieChart,
  } from "react-native-chart-kit";
import { data } from '@/components/Chart/BarChart/constants';

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};
function Stats() {
    const { colors } = useTheme()
    const [activeWeekIndex, setActiveWeekIndex] = useState(0);
    // const data = [
    //     {
    //         name: "Proteins",
    //         population: 102,
    //         color: "rgba(131, 167, 234, 1)",
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    //     {
    //         name: "Fats",
    //         population: 30,
    //         color: colors.primary,
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    //     {
    //         name: "Carbs",
    //         population: 200,
    //         color: colors.blueLight,
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    // ];
    return (
        <View style={[styles.container, { backgroundColor: colors.white}]}>
            {/* <CalorieBarChart/>
            <PieChart
                data={data}
                width={300}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[0, 0]}
                absolute
            /> */}
                    <View style={{padding: 40}}>
            <Text>Nutri Weeks calories</Text>
            </View>
            <WeeklyBarChart
                weeks={data}
                activeWeekIndex={activeWeekIndex}
                onWeekChange={setActiveWeekIndex}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Stats