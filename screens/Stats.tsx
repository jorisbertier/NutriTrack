import { WeeklyBarChart } from "@/components/Chart/BarChart";
import { useTheme } from "@/hooks/ThemeProvider";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getDataConsumeByDays } from '@/components/Chart/BarChart/constants';
import Row from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { calculateTotalCalories, fetchUserDataConnected } from "@/functions/function";
import { User } from "@/interface/User";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomPie from "@/components/Chart/Pie/CustomPie";
import { Skeleton } from "moti/skeleton";
import { colorMode } from '@/constants/Colors';
import WeightChart from "@/components/Chart/WeightChart";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";


function Stats() {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = useState(true);

    const userRedux = useSelector((state: RootState) => state.user.user);
    const isPremium = useSelector((state: RootState) => state.subscription.isPremium);
    const [activeWeekIndex, setActiveWeekIndex] = useState(0);

    const navigation = useNavigation();

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
            value: Number(value),
        }));
    } else {
        console.error("userRedux is undefined");
    }
    const totalCalories = calculateTotalCalories(dataConsumeByDays);
    console.log('total :', totalCalories)
    const sortedData = dataConsumeByDays?.sort((a, b) => new Date(a.day) - new Date(b.day));
    const data2 = getDataConsumeByDays(sortedData)

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

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.white}]}>
            <TouchableOpacity onPress={() => navigation.navigate('Badge')}>
                <Text>Badge</Text>
            </TouchableOpacity>
            <Row style={{marginBottom: 15,marginTop: 20, marginLeft: 10}}>
                <ThemedText variant='title' color={colors.black}>Nutri calories</ThemedText>
            </Row>
            <Text style={{ marginLeft: 10, marginBottom: 70, flexWrap: "wrap", width: '90%' , color: colors.black}}>
                {t('nutriCalories')}
            </Text>
            <WeeklyBarChart
                weeks={data2}
                activeWeekIndex={activeWeekIndex}
                onWeekChange={setActiveWeekIndex}
            />
            <Row style={{marginBottom: 0, marginTop: 20, marginLeft: 10}}>
                <ThemedText variant='title' color={colors.black}>Nutri ratio</ThemedText>
            </Row>
            <Text
            style={{marginLeft: 10, flexWrap: "wrap",width: '90%', marginTop: 10, color: colors.black
            }}
            >
                {t('nutriRatio')}
            </Text>

            {totalMacronutrients == 0 ?
            <Row style={{paddingTop: 70 , alignSelf: 'center'}}>
                <Text style={[stylesNoData.message, {marginTop: 0, color: colors.black}]}>
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
            <Row style={{marginBottom: 15, marginTop: 20, marginLeft: 10}}>
                <ThemedText variant='title' color={colors.black}>Nutri weight</ThemedText>
            </Row>
                <Text style={{ marginLeft: 10, color: colors.black }}>{t('nutriWeight')}</Text>
                {isPremium ? (
                    <WeightChart/>
                ): (
                    <Image
                        source={require('@/assets/images/icon/crown.png')}
                        style={{ tintColor: "#FFD700", width: 20, height: 20, alignSelf: 'center', marginVertical: 40 }}
                        resizeMode="contain"
                    />
                )}
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