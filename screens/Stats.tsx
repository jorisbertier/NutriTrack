import { WeeklyBarChart } from "@/components/Chart/BarChart";
import { useTheme } from "@/hooks/ThemeProvider";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { data, getDataConsumeByDays } from '@/components/Chart/BarChart/constants';
import Row from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { fetchUserDataConnected } from "@/functions/function";
import { User } from "@/interface/User";
import { getAuth } from "firebase/auth";
import { parseISO, startOfWeek } from "date-fns";

function Stats() {
    const { colors } = useTheme()

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = useState(true)

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
        return <View><Text>Chargement...</Text></View>;
    }

    
    if (userData.length > 0 && userData[0]?.consumeByDays) {
        const normalizeDate = (date) => new Date(`${date}T00:00:00Z`).toISOString().split('T')[0];
    
        dataConsumeByDays = Object.keys(userData[0].consumeByDays).map(date => ({
            day: normalizeDate(date),
            value: userData[0]?.consumeByDays[date],
        }));
    
        console.log('Données normalisées (dataConsumeByDays):', dataConsumeByDays);
    } else {
        console.error("consumeByDays est undefined ou n'est pas un objet valide");
    }

    
    const sortedData = dataConsumeByDays?.sort((a, b) => new Date(a.day) - new Date(b.day));
    const data2 = getDataConsumeByDays(sortedData)
    // console.log('data2', data2)

    const adjustWeeksToStartOnMonday = (weeks: any[]) => {
        return weeks.map((week) => {
        // On prend le premier jour de la semaine (par exemple, le 31 décembre) et on ajuste pour qu'il commence un lundi
        const mondayStart = startOfWeek(parseISO(week[0].day), { weekStartsOn: 1 }); // 1 = lundi
        
        // Maintenant, on ajuste chaque jour de la semaine pour qu'il soit aligné avec le lundi
        return week.map((day) => {
            // On crée un nouvel objet Date en UTC, et on ajuste pour chaque jour de la semaine
            const adjustedDay = new Date(Date.UTC(
            mondayStart.getUTCFullYear(),
            mondayStart.getUTCMonth(),
            mondayStart.getUTCDate() + week.indexOf(day),
            0, 0, 0, 0 // Assurer que l'heure est 00:00:00 UTC
            ));
    
            return {
            ...day,
            day: adjustedDay.toISOString(), // Formater en ISO 8601 avec T00:00:00.000Z
            };
        });
        });
    };
    const adjustedData2 = adjustWeeksToStartOnMonday(data2);
    
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
            <Row style={{marginBottom: 60}}>
                <ThemedText variant='title' color={colors.black}>Nutri week calories</ThemedText>
            </Row>
            <WeeklyBarChart
                weeks={adjustedData2}
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