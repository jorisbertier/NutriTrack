import { WeeklyBarChart } from "@/components/Chart/BarChart";
import { useTheme } from "@/hooks/ThemeProvider";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getDataConsumeByDays } from '@/components/Chart/BarChart/constants';
import Row from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { fetchUserDataConnected } from "@/functions/function";
import { User } from "@/interface/User";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomPie from "@/components/Chart/Pie/CustomPie";
import { Skeleton } from "moti/skeleton";
import { colorMode } from '@/constants/Colors';
import WeightChart from "@/components/Chart/WeightChart";
import { useTranslation } from "react-i18next";


function Stats() {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = useState(true);

    const userRedux = useSelector((state: RootState) => state.user.user)
    const [activeWeekIndex, setActiveWeekIndex] = useState(0);

    useEffect(() => {
        try {
            const fetchData = async () => {
            }
            fetchData()
            fetchUserDataConnected(user, setUserData)
        } catch (e) {
            console.log('Error processing data', e);
        }finally {
            setIsLoading(false)
        }
    }, []);

    let dataConsumeByDays;

    if (isLoading || userData.length === 0) {
        
        return <View style={{width: '90%', alignSelf: 'center', marginTop: 20}}>
                <View style={{marginBottom: 20}}>
                    <Skeleton colorMode={colorMode} width={'100%'} height={75}/>
                </View>
                <View style={{marginBottom: 20}}>
                    <Skeleton colorMode={colorMode} width={'100%'} height={75}/>
                </View>
                <View style={{marginBottom: 20}}>
                    <Skeleton colorMode={colorMode} width={'100%'} height={75}/>
                </View>
                <View style={{marginBottom: 20}}>
                    <Skeleton colorMode={colorMode} width={'100%'} height={75}/>
                </View>
                </View>
    }

    
    if (userRedux) {
        const normalizeDate = (date: any) => new Date(`${date}T00:00:00Z`).toISOString().split('T')[0];
        dataConsumeByDays = Object.entries(userRedux?.consumeByDays).map(([day, value]) => ({
            day: normalizeDate(day),
            value,
        }));
    } else {
        console.error("userRedux is undefined");
    }
    
    const sortedData = dataConsumeByDays?.sort((a, b) => new Date(a.day) - new Date(b.day));
    const data2 = getDataConsumeByDays(sortedData)

    // const adjustWeeksToStartOnMonday = (weeks: any[]) => {
    //     return weeks.map((week) => {
    //     // On prend le premier jour de la semaine (par exemple, le 31 décembre) et on ajuste pour qu'il commence un lundi
    //     const mondayStart = startOfWeek(parseISO(week[0].day), { weekStartsOn: 1 }); // 1 = lundi
        
    //     // Maintenant, on ajuste chaque jour de la semaine pour qu'il soit aligné avec le lundi
    //     return week.map((day) => {
    //         // On crée un nouvel objet Date en UTC, et on ajuste pour chaque jour de la semaine
    //         const adjustedDay = new Date(Date.UTC(
    //         mondayStart.getUTCFullYear(),
    //         mondayStart.getUTCMonth(),
    //         mondayStart.getUTCDate() + week.indexOf(day),
    //         0, 0, 0, 0 // Assurer que l'heure est 00:00:00 UTC
    //         ));
    
    //         return {
    //         ...day,
    //         day: adjustedDay.toISOString(), // Formater en ISO 8601 avec T00:00:00.000Z
    //         };
    //     });
    //     });
    // };
    // const adjustedData2 = adjustWeeksToStartOnMonday(data2);
    // console.log('adju', adjustedData2)
    // console.log(userRedux)
    // console.log('test',userRedux?.fatsTotal)
    if (!userRedux?.consumeByDays || !data2 || !userRedux?.proteinsTotal) {
        return (
            <View style={stylesNoData.container}>
                <Text style={stylesNoData.message}>
                    📊 {t('not_enought_data_statictis')}
                </Text>
                <Text style={stylesNoData.subMessage}>
                    {t('text_enought')}
                </Text>
            </View>
        );
    }
    const totalProteins =(Object.values(userRedux?.proteinsTotal).reduce((a,b) =>  a = a + b , 0 ));
    const totalCarbs = (Object.values(userRedux?.carbsTotal).reduce((a,b) =>  a = a + b , 0 ));
    const totalFats = (Object.values(userRedux?.fatsTotal).reduce((a,b) =>  a = a + b , 0 ));

    const totalMacronutrients = Number(totalProteins) + Number(totalCarbs) + Number(totalFats)

    const pieData = [
        { value: totalProteins, color: "#98CDFC", macro: 'proteins' },
        { value: totalCarbs, color: "#57D1E3" , macro: 'carbohydrates'},
        { value: totalFats, color: "#5F6A88" , macro: 'fats'},
        // { value: 10, color: "#93A0FF" },
        // { value: 25, color: "#95D3BE" },
    ];

    console.log('proteins',typeof totalMacronutrients)

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.white}]}>
            <Row style={{marginBottom: 80,marginTop: 20, marginLeft: 10}}>
                <ThemedText variant='title' color={colors.black}>Nutri calories</ThemedText>
            </Row>
            <WeeklyBarChart
                weeks={data2}
                activeWeekIndex={activeWeekIndex}
                onWeekChange={setActiveWeekIndex}
            />
            <Row style={{marginBottom: 30, marginTop: 20, marginLeft: 10}}>
                <ThemedText variant='title' color={colors.black}>Nutri weight</ThemedText>
            </Row>
                <WeightChart/>
            <Row style={{marginBottom: 0, marginTop: 20, marginLeft: 10}}>
                <ThemedText variant='title' color={colors.black}>Nutri ratio</ThemedText>
            </Row>
            {totalMacronutrients == 0 ?
            <Row style={{paddingTop: 70 , alignSelf: 'center'}}>
                <Text style={[stylesNoData.message, {marginTop: 0}]}>
                    📊 {t('not_enought_data')}
                </Text>
            </Row>
            :
                <CustomPie
                    data={pieData}
                    innerRadius={20}
                    outerRadius={100}
                    paddingAngle={0.05}
                    cornerRadius={10}
                    startAngle={0}
                    endAngle={2 * Math.PI}
                    cx={150}
                    cy={150}
                    totalMacronutrients={totalMacronutrients}
                />
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        // justifyContent: 'center',
    }
})

const stylesNoData = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
    },
    subMessage: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});


export default Stats