import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TextInput, Image, View, FlatList, TouchableOpacity, Text, ScrollView} from "react-native";
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
import Svg, { Path } from "react-native-svg";

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

    const goToPreviousDay = () => {
    setSelectedDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(prevDate.getDate() - 1);
        return newDate;
    });
    };

    const goToNextDay = () => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 1);
            return newDate;
        });
    };
    return (
        <>
            <View style={{flexDirection: "row", width: "100%", paddingTop: 10, justifyContent: "space-around", backgroundColor: colors.whiteMode}}>
                <TouchableOpacity onPress={goToPreviousDay} style={{backgroundColor: colors.grayMode, width: "10%", justifyContent: "center", alignItems: "center", borderRadius: 10, height: 40}}>
                    <Image source={require('@/assets/images/arrow-right.png')} style={{tintColor: colors.black, width: 20, height: 20, transform: [{ scaleX: -1 }]}}/>
                </TouchableOpacity>
                <View style={{width: '70%',alignSelf: 'center', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.grayMode}}>
                    <TouchableOpacity onPress={handleOpenCalendar}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100%', width: '40%'}}>
                            <ThemedText variant="title1" color={colors.black} style={{height: '100%', textAlignVertical: 'center', textAlign: 'center'}}>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ?
                                t('today'):
                                `${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}
                            </ThemedText>
                            <Image source={require('@/assets/images/calendar.png')} style={{tintColor: colors.black, width: 25, height: 25}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={goToNextDay} style={{backgroundColor: colors.grayMode, width: "10%", justifyContent: "center", alignItems: "center", borderRadius: 10, height: 40}}>
                    <Image source={require('@/assets/images/arrow-right.png')} style={{tintColor: colors.black, width: 20, height: 20}}/>
                </TouchableOpacity>
            </View>
            
            <SafeAreaView style={[styles.header, {backgroundColor: colors.whiteMode}]}>
                {isOpen && (<RNDateTimePicker
                    onChange={setDate}
                    value={selectedDate}
                    timeZoneName={timeZone}
                    // timeZoneOffsetInMinutes={new Date().getTimezoneOffset()}
                />)}
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
                <Row style={[styles.wrapperFood]}>
                { text.length === 0 && (
                    <ScrollView horizontal={true} style={styles.row} contentContainerStyle={{ gap: 12, paddingRight: 12 }} showsHorizontalScrollIndicator={false} >
                            <TouchableOpacity
                                // @ts-ignore
                                onPress={() => navigation.navigate("Scanner", { date : selectedDate.toLocaleDateString() })}
                                style={[styles.wrapper, { backgroundColor: colors.blueLight }]}
                                activeOpacity={0.85}
                            >
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                <Path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5 8a1 1 0 0 1-2 0V5.923c0-.76.082-1.185.319-1.627.223-.419.558-.754.977-.977C4.738 3.082 5.162 3 5.923 3H8a1 1 0 0 1 0 2H5.923c-.459 0-.57.022-.684.082a.364.364 0 0 0-.157.157c-.06.113-.082.225-.082.684V8zm3 11a1 1 0 1 1 0 2H5.923c-.76 0-1.185-.082-1.627-.319a2.363 2.363 0 0 1-.977-.977C3.082 19.262 3 18.838 3 18.077V16a1 1 0 1 1 2 0v2.077c0 .459.022.57.082.684.038.07.087.12.157.157.113.06.225.082.684.082H8zm7-15a1 1 0 0 0 1 1h2.077c.459 0 .57.022.684.082.07.038.12.087.157.157.06.113.082.225.082.684V8a1 1 0 1 0 2 0V5.923c0-.76-.082-1.185-.319-1.627a2.363 2.363 0 0 0-.977-.977C19.262 3.082 18.838 3 18.077 3H16a1 1 0 0 0-1 1zm4 12a1 1 0 1 1 2 0v2.077c0 .76-.082 1.185-.319 1.627a2.364 2.364 0 0 1-.977.977c-.442.237-.866.319-1.627.319H16a1 1 0 1 1 0-2h2.077c.459 0 .57-.022.684-.082a.363.363 0 0 0 .157-.157c.06-.113.082-.225.082-.684V16zM3 11a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3z"
                                    fill="#000"
                                />
                            </Svg>
                            </TouchableOpacity>
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
                    </ScrollView>
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
                                notification={notificationVisible}
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
        flexDirection: 'row',
        paddingVertical: 10,
    },
    wrapper : {
        flex: 1,
        height: 60,
        width: 130,
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
})