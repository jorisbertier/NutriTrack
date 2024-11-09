import { ThemedText } from "@/components/ThemedText";
import useThemeColors from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, Image, View, FlatList, TouchableOpacity, Text, useColorScheme} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Row from "@/components/Row";
import CardFood from "@/components/Search/CardFood";
import { foodData } from "@/data/food.js";
import { useEffect, useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FoodItem } from "@/interface/FoodItem";
import { capitalizeFirstLetter } from "@/functions/function";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/hooks/ThemeProvider";

export default function Search() {

    const {theme, colors} = useTheme();

    const [data, setData] = useState<FoodItem[]>([]);
    const [error, setError] = useState("");
    const [text, onChangeText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date());
    const [notificationVisible, setNotificationVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    const colorMode: 'light' | 'dark' = 'light';
    
    let date = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
        setIsOpen(false)
        if(date) {
            setSelectedDate(date);
        }
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
        } finally {
            setIsLoading(true);
        }
    }, []);
    

    const filteredFood = data.filter(food => food.name.toLowerCase().includes(text.toLowerCase().trim()));

    const handleOpenCalendar = () => {
        setIsOpen(!isOpen)
        console.log("Calendar opened:", !isOpen);
    }

    const handleDeleteValue = () => {
        onChangeText('')
    }

    console.log("Current theme:", theme)
    return (
        <>
            <View style={{width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.grayMode}}>
                <TouchableOpacity onPress={handleOpenCalendar}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100%', width: '40%'}}>
                        <ThemedText variant="title1" color={colors.black} style={{height: '100%', textAlignVertical: 'center', textAlign: 'center'}}>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ?
                            'Today':
                            `${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}
                        </ThemedText>
                        {theme === "light" ?
                        <Image source={require('@/assets/images/chevron-bas.png')} style={{width: 20, height: 20}}/>
                        :
                        <Image source={require('@/assets/images/chevronWhite.png')} style={{width: 20, height: 20}}/>
                        }
                    </View>
                </TouchableOpacity>
            </View>
            <SafeAreaView style={[styles.header, {backgroundColor: colors.whiteMode}]}>
                {/* <Row>
                    <View style={[styles.wrapperCalendar, backgroundColor : '#F6F6F6']}>
                    <TouchableOpacity onPress={handleOpenCalendar}>
                        <Image source={require('@/assets/images/calendar.png')} style={styles.calendar}/>
                    </TouchableOpacity>
                        <ThemedText variant="title1">
                            {selectedDate.toLocaleDateString() === date.toLocaleDateString() ? 'Today': `${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}
                            </ThemedText>
                    </View> */}
                    {}
                    {isOpen && (<RNDateTimePicker
                        onChange={setDate}
                        value={selectedDate}
                        timeZoneName={timeZone}
                        // timeZoneOffsetInMinutes={new Date().getTimezoneOffset()}
                    />)}
                {/* </Row> */}
                <View style={styles.wrapperInput}>
                    <TextInput
                        style={[styles.input, {backgroundColor: colors.grayMode, color: colors.black}]}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="Search a food"
                        placeholderTextColor={'grey'}
                    >
                    </TextInput>
                        {/* <Image source={require('@/assets/images/search.png')} style={styles.iconSearch}/> */}
                        {text !== '' ? (
                            <TouchableOpacity style={[styles.wrapperDelete, { backgroundColor: colors.morphism2}]} onPress={handleDeleteValue}>
                                <Image source={require('@/assets/images/delete.png')} style={styles.deleteSearch}/>
                            </TouchableOpacity>
                            ) : (
                            null
                        )}
                        
                        <Image source={require('@/assets/images/search.png')} style={styles.iconSearch}/>

                </View>
                {/* <Row>
                    <View style={[styles.wrapperCreate, {backgroundColor : '#F6F6F6'}]}>
                        <Image source={require('@/assets/images/grapes.png')} style={styles.imageCreate}/>
                        <ThemedText variant="title1">Create a new aliment</ThemedText>
                    </View>
                </Row> */}
                <Row style={[styles.wrapperFood]}>
                        <FlatList<FoodItem>
                            data={filteredFood}
                            renderItem={({ item }) => (
                                <CardFood
                                    name={item.name}
                                    id={item.id}
                                    calories={item.calories}
                                    unit={item.unit}
                                    quantity={item.quantity}
                                    selectedDate={selectedDate.toLocaleDateString()}
                                    setNotification={setNotificationVisible}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            contentContainerStyle={styles.wrapperFood}
                        />
                    {filteredFood.length === 0 && <Text style={{color: colors.black}}>
                        No food matches with the search {text}.</Text>}
                </Row>
                {notificationVisible &&
                    <View style={styles.notification}>
                        <View style={[styles.wrapperNotification, {backgroundColor: "#8592F2"}]}>
                            <Text style={styles.notificationText}>Added Food</Text>
                            <Image style={styles.verify} source={require('@/assets/images/verify2.png')} />
                        </View>
                    </View>
                }
            </SafeAreaView>
        </>
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
        alignItems: 'center',
        marginTop: -20
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
        gap: 10,
        paddingBottom: 30
    },
    wrapperCreate : {
        height: 80,
        width: 300,
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
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 5,
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