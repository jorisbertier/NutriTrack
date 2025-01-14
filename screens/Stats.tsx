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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CustomPie from "@/components/Chart/Pie/CustomPie";


function Stats() {
    const { colors } = useTheme()

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
        return <View><Text>Chargement...</Text></View>;
    }

    
    if (userRedux) {
        const normalizeDate = (date) => new Date(`${date}T00:00:00Z`).toISOString().split('T')[0];
    
        dataConsumeByDays = Object.entries(userRedux.consumeByDays).map(([day, value]) => ({
            day: normalizeDate(day),
            value,
        }));
    
        console.log('Données normalisées (dataConsumeByDays):', dataConsumeByDays);
    } else {
        console.error("consumeByDays est undefined ou n'est pas un objet valide");
    }
    
    const sortedData = dataConsumeByDays?.sort((a, b) => new Date(a.day) - new Date(b.day));
    const data2 = getDataConsumeByDays(sortedData)

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
    
    const pieData = [
        { value: 1000, color: "#98CDFC" },
        { value: 1300, color: "#57D1E3" },
        { value: 500, color: "#5F6A88" },
        // { value: 10, color: "#93A0FF" },
        // { value: 25, color: "#95D3BE" },
    ];
    
    return (
        <View style={[styles.container, { backgroundColor: colors.white}]}>
            <Row style={{marginBottom: 60}}>
                <ThemedText variant='title' color={colors.black}>Nutri week calories</ThemedText>
            </Row>
            <WeeklyBarChart
                weeks={adjustedData2}
                activeWeekIndex={activeWeekIndex}
                onWeekChange={setActiveWeekIndex}
            />
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