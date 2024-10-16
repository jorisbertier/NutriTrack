import { ThemedText } from "@/components/ThemedText";
import useThemeColors from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, Image, View, FlatList} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Row from "@/components/Row";
import CardFood from "@/components/Search/CardFood";
import { getData } from "@/services/api";
import { foodData } from "@/data/food.js";
import { useEffect, useState } from "react";

interface FoodItem {
    id: number;
    name: string;
    nutrition: {
        calories: string;
        servingSize: {
            unit: string;
            quantity: number;
        };
    };
}


export default function Search() {

    const [data, setData] = useState<FoodItem[]>([]);
    const [error, setError] = useState("");
    const [text, onChangeText] = useState('');

    useEffect(() => {
        try {
            if (foodData && foodData.length > 0) {
                setData(foodData);
            } else {
                setError('No data found');
            }
        } catch (e) {
            setError('Error processing data');
        }
    }, []);
    
    const colors = useThemeColors()

    const filteredFood = data.filter(food => food.name.toLowerCase().includes(text.toLowerCase().trim()))

    return (
        <SafeAreaView style={styles.header}>
            <ThemedText>Voici ma page search</ThemedText>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="Search a food"
                placeholderTextColor={'black'}
            >
                {/* <Image source={require('@/assets/images/search.png')} style={styles.iconSearch}/> */}
            </TextInput>

            <Row style={styles.wrapperFood}>
                <FlatList<FoodItem>
                    data={filteredFood}
                    renderItem={({ item }) => (
                        <CardFood
                            name={item.name}
                            id={item.id}
                            calories={item.nutrition.calories}
                            unit={item.nutrition.servingSize.unit}
                            quantity={item.nutrition.servingSize.quantity}
                            
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.wrapperFood}
                />
            </Row>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        backgroundColor: 'white',
        flex: 1
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSearch : {
        width: 25,
        height: 25
    },
    wrapperFood : {
        flexDirection: 'column',
        gap: 10
    },
})