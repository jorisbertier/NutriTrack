import CalorieBarChart from "@/components/Chart/Polar";
import { StyleSheet, View } from "react-native";

function Stats() {
    return (
        <View style={styles.container}>
            <CalorieBarChart/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Stats