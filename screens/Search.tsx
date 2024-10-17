import { ThemedText } from "@/components/ThemedText";
import useThemeColors from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, Image, View, FlatList, TouchableOpacity, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Row from "@/components/Row";
import CardFood from "@/components/Search/CardFood";
import { getData } from "@/services/api";
import { foodData } from "@/data/food.js";
import { useEffect, useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

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
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date());
    const [notificationVisible, setNotificationVisible] = useState(false); 
    const date = new Date();

    const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
        console.log(event)
        if(date) {
            setSelectedDate(date);
            setIsOpen(false)
        }
        console.log('Calendar close')
    };
    useEffect(() => {

    }, [selectedDate])

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

    const filteredFood = data.filter(food => food.name.toLowerCase().includes(text.toLowerCase().trim()));

    const handleOpenCalendar = () => {
        setIsOpen(!isOpen)
        console.log("Calendar opened:", !isOpen);
    }

    const handleDeleteValue = () => {
        onChangeText('')
    }
    return (
        <SafeAreaView style={styles.header}>
            <Row>
                <View style={styles.wrapperCalendar}>
                <TouchableOpacity onPress={handleOpenCalendar}>
                    <Image source={require('@/assets/images/calendar.png')} style={styles.calendar}/>
                </TouchableOpacity>
                    <ThemedText variant="title1">
                        {selectedDate.toLocaleDateString() === date.toLocaleDateString() ? 'Today': selectedDate.toLocaleDateString()}
                        </ThemedText>
                </View>
                {isOpen && (<RNDateTimePicker
                    onChange={setDate}
                    value={selectedDate}
                    timeZoneOffsetInMinutes={new Date().getTimezoneOffset()}
                    onDismiss={() => setIsOpen(false)}
                />)}
            </Row>
            <View style={styles.wrapperInput}>
                <TextInput
                    style={[styles.input, {backgroundColor: '#F6F6F6'}]}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Search"
                    placeholderTextColor={'grey'}
                >
                </TextInput>
                    {/* <Image source={require('@/assets/images/search.png')} style={styles.iconSearch}/> */}
                    {text !== '' ? (
                        <TouchableOpacity style={styles.wrapperDelete} onPress={handleDeleteValue}>
                            <Image source={require('@/assets/images/delete.png')} style={styles.deleteSearch}/>
                        </TouchableOpacity>
                        ) : (
                        null
                    )}
                    
                    <Image source={require('@/assets/images/search.png')} style={styles.iconSearch}/>

            </View>
            {/* <Row>
                <View style={styles.wrapperCreate}>
                    <Image source={require('@/assets/images/grapes.png')} style={styles.imageCreate}/>
                    <ThemedText variant="title1">Create a new aliment</ThemedText>
                </View>
            </Row> */}
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
                            selectedDate={selectedDate.toLocaleDateString()}
                            setNotification={setNotificationVisible}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={styles.wrapperFood}
                />
            </Row>
            {notificationVisible &&
                <View style={styles.notification}>
                    <View style={styles.wrapperNotification}>
                        <Text style={styles.notificationText}>Added Food</Text>
                        <Image style={styles.verify} source={require('@/assets/images/verify2.png')} />
                    </View>
                </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        backgroundColor: 'white',
        flex: 1,
        position: 'relative',
    },
    wrapperInput :{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 50,
        margin: 12,
        borderRadius: 15,
        padding: 10,
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingStart: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderBlockColor: 'transparent',
        width: '100%'
    },
    iconSearch : {
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: [{ translateY: -9.5 }], 
        width: 20,
        height: 20,
        tintColor: '#8a8a8a',
        
    },
    wrapperDelete : {
        position: 'absolute',
        right: 30,
        top: '50%',
        transform: [{ translateY: -13 }],
        backgroundColor: 'rgba(18, 18, 18, 0.08)',
        padding: 7,
        borderRadius: 8
    },
    deleteSearch : {
        height: 15,
        width: 15,
        tintColor: '#8a8a8a',
        
    },
    wrapperFood : {
        flexDirection: 'column',
        gap: 10
    },
    wrapperCreate : {
        height: 80,
        width: 300,
        backgroundColor : '#F6F6F6',
        borderRadius: 30,
        marginVertical: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    imageCreate : {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        zIndex: 2,
    },
    wrapperCalendar : {
        gap: 10,
        width: 200,
        height: 60,
        borderRadius: 15,
        backgroundColor : '#F6F6F6',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingLeft: 15
    },
    calendar : {
        height: 35,
        width: 35
    },
    notification: {
        position: "absolute",
        bottom: 20,
        width: '100%',
        alignSelf: 'center'
    },
    wrapperNotification : {
        backgroundColor: "#8592F2",
        flexDirection: 'row',
        justifyContent:'center',
        gap: 20,
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2, 
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    notificationText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    verify : {
        width: 20,
        height: 20
    }
})