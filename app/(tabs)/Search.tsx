import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TextInput, Image, View, FlatList, TouchableOpacity, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Row from "@/components/Row";
import CardFood from "@/components/Search/CardFood";
import { foodData } from "@/data/food.js";
import React, { useEffect, useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FoodItem } from "@/interface/FoodItem";
import { capitalizeFirstLetter } from "@/functions/function";
import { useTheme } from "@/hooks/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function Search() {

    const {theme, colors} = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();

    const [data, setData] = useState<FoodItem[]>([]);
    const [text, onChangeText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date());
    const [notificationVisible, setNotificationVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    const colorMode: 'light' | 'dark' = 'light';
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

    
    let date = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
        setIsOpen(false)
        if(date) {
            setSelectedDate(date);
        }
    };
    console.log(selectedDate)
    
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

    const filteredFood = data.filter(food => {
    const nameByLang = {
        fr: food.name_fr,
        es: food.name_es,
        en: food.name_en
    };
    const foodName = nameByLang[i18n.language] || food.name_en;
        return foodName.toLowerCase().includes(text.toLowerCase().trim());
    });

    const handleOpenCalendar = () => {
        setIsOpen(!isOpen)
    }

    const handleDeleteValue = () => {
        onChangeText('')
    }

    return (
        <>
            <View style={{width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.grayMode}}>
                <TouchableOpacity onPress={handleOpenCalendar}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100%', width: '40%'}}>
                        <ThemedText variant="title1" color={colors.black} style={{height: '100%', textAlignVertical: 'center', textAlign: 'center'}}>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ?
                            t('today'):
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
                    {isOpen && (<RNDateTimePicker
                        onChange={setDate}
                        value={selectedDate}
                        timeZoneName={timeZone}
                        // timeZoneOffsetInMinutes={new Date().getTimezoneOffset()}
                    />)}
                {/* </Row> */}
                
                <View style={styles.wrapperInput}>
                    <TextInput
                        style={[styles.input, {backgroundColor: colors.white, color: colors.black, borderColor: isFocused ? colors.back : colors.grayDarkFix}]}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder={t('searchFood')}
                        placeholderTextColor={'grey'}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
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
                        
                        <Image source={require('@/assets/images/search.png')} style={[styles.iconSearch, { tintColor: isFocused ? colors.black : '#8a8a8a'}]}/>

                </View>
                {/* <Row>
                    <View style={[styles.wrapperCreate, {backgroundColor : '#F6F6F6'}]}>
                        <Image source={require('@/assets/images/grapes.png')} style={styles.imageCreate}/>
                        <ThemedText variant="title1">Create a new aliment</ThemedText>
                    </View>
                </Row> */}
                <Row style={[styles.wrapperFood]}>
          { text.length === 0 && (
    <Row style={styles.row}>
        {/* Bouton Créer Aliment */}
        {isPremium ? (
            <TouchableOpacity
                onPress={() => navigation.navigate("CreateAliment")}
                style={[styles.wrapper, { backgroundColor: colors.blueLight }]}
                activeOpacity={0.85}
            >
                <Image
                    source={require('@/assets/images/add.png')}
                    style={{ width: 22, height: 22, tintColor: colors.blackFix }}
                />
                <ThemedText
                    variant='title3'
                    style={{ marginLeft: 8, color: colors.blackFix, fontSize: 13, fontWeight: '600' }}
                >
                    {t('create')}
                </ThemedText>
            </TouchableOpacity>
        ) : (
            <View style={[styles.wrapper, { backgroundColor: colors.blueLight, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                <Image
                    source={require('@/assets/images/icon/crown.png')}
                    style={{ width: 20, height: 20, tintColor: "#FFD700" }}
                />
            </View>
        )}

        {/* Bouton Liste Aliment */}
        {isPremium ? (
            <TouchableOpacity
                onPress={() => navigation.navigate("SearchAlimentCreated")}
                style={[styles.wrapper, { backgroundColor: colors.blueLight }]}
                activeOpacity={0.85}
            >
                <ThemedText
                    variant='title3'
                    style={{ color: colors.blackFix, fontSize: 13, fontWeight: '600' }}
                >
                    {t('list')}
                </ThemedText>
            </TouchableOpacity>
        ) : (
            <View style={[styles.wrapper, { backgroundColor: colors.blueLight, justifyContent: 'center', alignItems: 'center' }]}>
                <Image
                    source={require('@/assets/images/icon/crown.png')}
                    style={{ width: 20, height: 20, tintColor: "#FFD700" }}
                />
            </View>
        )}
    </Row>
)}

                        <FlatList<FoodItem>
                            data={filteredFood.slice(0, 40)}
                            renderItem={({ item }) => (
                                <CardFood
                                    name={`${item[`name_${i18n.language}`] || item.name_en}`}
                                    id={item.id}
                                    calories={item.calories}
                                    unit={item.unit}
                                    quantity={item.quantity}
                                    selectedDate={selectedDate.toLocaleDateString()}
                                    setNotification={setNotificationVisible}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) =>
                                item.userMealId ? `meal-${item.userMealId}` : `id-${item.id}-${index}`
                        }
                            contentContainerStyle={styles.wrapperFood}
                        />
                        
                    {filteredFood.length === 0 && <Text style={{color: colors.black}}>
                        {t('matchFood')} {text}.</Text>
                    }
                </Row>
                {notificationVisible && (
                    <View style={styles.notification}>
                        <View style={styles.wrapperNotification}>
                        <Text style={styles.notificationText}>✓ {t('added')}</Text>
                            <LottieView
                                source={require('@/assets/lottie/check-popup.json')}
                                loop={false}
                                style={{ width: 30, height: 30 }}
                                autoPlay={true}
                            />
                        </View>
                    </View>
                )}
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
        marginTop: 5
    },
    input: {
        width: "90%",
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginBottom: 20,
        fontSize: 15,
        fontWeight: 500,
        paddingLeft: 40
    },
    iconSearch : {
        position: 'absolute',
        left: 30,
        top: '50%',
        transform: [{ translateY: -19 }], 
        width: 20,
        height: 20,
    },
    wrapperDelete : {
        position: 'absolute',
        right: 40,
        top: '50%',
        transform: [{ translateY: -23 }],
        padding: 7,
        borderRadius: 8
    },
    row : {
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12,
        gap: 12,
    },
    wrapper : {
        flex: 1,
        height: 60,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    deleteSearch : {
        height: 15,
        width: 15,
        tintColor: '#8a8a8a',
        
    },
    wrapperFood : {
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 100,
        
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
        bottom: 30,
        width: "100%",
        alignItems: "center",
        zIndex: 999
    },
    wrapperNotification: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    notificationText: {
        color: "#333",
        fontWeight: "600",
        fontSize: 16,
        textAlign: "center",
        marginRight: 10
    },
    wrapperBloc: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: '35%',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})