import { StyleSheet, TextInput, Image, View, FlatList, TouchableOpacity, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Row from "@/components/Row";
import React, { useContext, useEffect, useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { fetchUserDataConnected } from "@/functions/function";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/hooks/ThemeProvider";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import CardFoodCreated from "@/components/SearchCreated/CardFoodCreated";
import { FoodContext } from "@/hooks/FoodContext";
import { FoodItemCreated } from "@/interface/FoodItemCreated";
import { User } from "@/interface/User";
import { useTranslation } from "react-i18next";
import { DayCarousel } from "@/components/DayCarousel";

function SearchAlimentCreated() {

    /*Get id user*/
    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const { allDataFoodCreated, setAllDataFoodCreated } = useContext(FoodContext);

    const { colors} = useTheme();
    const { t } = useTranslation();

    const [text, onChangeText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date());
    const [notificationVisible, setNotificationVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    const [ isFocused, setIsFocused] = useState(false);

    const colorMode: 'light' | 'dark' = 'light';

    useEffect(() => {
        try {
            const fetch = async () => {
                fetchUserDataConnected(user, setUserData)
            }
            fetch()
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, [user]);
    

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                // Référence à la collection "UserCreatedFoods"
                const collectionRef = collection(firestore, "UserCreatedFoods");
    
                // Récupérer tous les documents de la collection
                const querySnapshot = await getDocs(collectionRef);
    
                const allData: FoodItemCreated[] = querySnapshot.docs.map(doc => ({
                    // const id = doc.id;
                    idDoc: doc.id,
                    ...(doc.data() as FoodItemCreated), // Type assertion ici
                }));
                
                if(userData[0]?.id) {
                    const filteredData = allData.filter(food => food.idUser === userData[0]?.id);
                    setAllDataFoodCreated(filteredData)
                    setIsLoading(true)

                }
            } catch (error) {
                console.error("Error getting collection UserCreatedFoods", error);
            }
        };
    
        fetchCollection();
    }, [userData]);

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

    }, [allDataFoodCreated])

    const handleOpenCalendar = () => {
        setIsOpen(!isOpen)
    }

    const handleDeleteValue = () => {
        onChangeText('')
    }

    const filteredAllDataFoodCreated = allDataFoodCreated.filter(food => food.title.toLowerCase().includes(text.toLowerCase().trim()));

    return (
        <>
            <View style={{flexDirection: "row", width: "100%", paddingTop: 10, justifyContent: "space-around", backgroundColor: colors.whiteMode}}>
                <DayCarousel
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    handleOpenCalendar={handleOpenCalendar}
                />
            </View>
        
        <SafeAreaView style={[styles.header, {backgroundColor: colors.whiteMode}]}>

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
                    placeholder={t('searchCreated')}
                    placeholderTextColor={'grey'}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                >
                </TextInput>
                    {text !== '' ? (
                        <TouchableOpacity style={[styles.wrapperDelete, { backgroundColor: colors.morphism2}]} onPress={handleDeleteValue}>
                            <Image source={require('@/assets/images/delete.png')} style={styles.deleteSearch}/>
                        </TouchableOpacity>
                        ) : (
                        null
                    )}
                    
                    <Image source={require('@/assets/images/search.png')} style={[styles.iconSearch, {tintColor: colors.black}]}/>

            </View>
            <Row style={[styles.wrapperFood]}>
            
                        {isLoading ?
                        
                    <FlatList<FoodItemCreated>
                        data={filteredAllDataFoodCreated}
                        renderItem={({ item }) => (
                            <CardFoodCreated
                                name={item.title}
                                id={Number(item.id)}
                                idDoc={item.idDoc}
                                calories={item.calories}
                                unit={item.unit}
                                quantity={item.quantity}
                                image={item.image}
                                selectedDate={selectedDate.toLocaleDateString()}
                                setNotification={setNotificationVisible}
                                notification={notificationVisible}
                                
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        contentContainerStyle={styles.wrapperFood}
                    />
                    : <>
                    <Skeleton colorMode={colorMode} width={'100%'} height={80}></Skeleton>
                    </>
                    }
                    
                    {isLoading && filteredAllDataFoodCreated.length === 0 && (
                        <Text style={{ color: colors.black }}>
                            {t('matchFood')} {text}.
                        </Text>
                    )}
            </Row>
        </SafeAreaView>
    </>
    )
}
const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 12,
        paddingBottom: 30,
        backgroundColor: 'white',
        flex: 1,
        position: 'relative'
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
        bottom: 60,
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
    verify : {
        width: 20,
        height: 20
    }
})

export default SearchAlimentCreated