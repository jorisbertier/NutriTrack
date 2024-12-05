import { ThemedText } from "@/components/ThemedText"
import { Image, Pressable, StyleSheet, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "expo-router";
import Row from "@/components/Row";
import NutritionStatCard from "@/components/Screens/Details/NutritionStatCard";
import { Dimensions } from "react-native";
import NutritionItem from "@/components/Screens/Details/NutritionItem";
import { CommonActions, useRoute } from "@react-navigation/native";
import { useState, useEffect, useContext } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from "@/interface/FoodItem";
import { useTheme } from "@/hooks/ThemeProvider";
import { navigationRef } from "@/app/_layout";
import { getAuth } from "firebase/auth";
import { fetchUserIdDataConnected } from "@/functions/function";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { FoodContext } from "@/hooks/FoodContext";

const { height } = Dimensions.get('window');

interface FoodItemCreated {
    idfirestore: string;
    id: string;
    idUser: number;
    title: string;
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
    quantity: number;
    unit: string;
}

export default function DetailsFoodCreated() {

    const {theme, colors} = useTheme();

    /*Get id user*/
    const [userIdConnected, setUserIdConnected] = useState<number>();
    const auth = getAuth();
    const user = auth.currentUser;

    // const [allDataFoodCreated, setAllDataFoodCreated] = useState<FoodItemCreated[]>([]);
    // const [allDataFoodCreated2, setAllDataFoodCreated2] = useState<FoodItemCreated[]>([]);
    const { allDataFoodCreated, setAllDataFoodCreated } = useContext(FoodContext);

    const navigation = useNavigation();
    const route = useRoute<any>();
    const { id } = route.params; 

    useEffect(() => {
        try {
            const fetch = async () => {
                fetchUserIdDataConnected(user, setUserIdConnected)
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
                    idfirestore: doc.id,
                    ...(doc.data() as FoodItemCreated), // Type assertion ici
                }));
                
                if(userIdConnected) {
                    const filteredData = allData.filter(food => food.idUser === userIdConnected);
                    setAllDataFoodCreated(filteredData)
                    console.log('new user data:', filteredData);
                    // setIsLoading(true)

                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la collection :", error);
                // setError("Erreur lors de la récupération des données.");
            }
        };
    
        fetchCollection();
    }, [userIdConnected]);
    console.log('getting page [id}' , allDataFoodCreated)
    // console.log()
    

    const handleGoBack = () => {
        if (navigationRef.current?.isReady()) {
            navigationRef.current.goBack();
        } else {
            console.log("Navigation is not ready yet");
        }
    };

    const filterUniqueFood = allDataFoodCreated.find((element) => element.id === id)
    console.log('new array', filterUniqueFood)

    const values = [filterUniqueFood?.proteins, filterUniqueFood?.carbs, filterUniqueFood?.fats]
    values.sort((a, b) => a - b);
    
    const associations = { [values[0]]: 65, [values[1]]: 90, [values[2]]: 120 };

    const associatedValues = {
    proteins: associations[filterUniqueFood?.proteins],
    carbohydrates: associations[filterUniqueFood?.carbs],
    fats: associations[filterUniqueFood?.fats],
    };

    
    return (
    <ScrollView>
        <View style={styles.banner}>
            <Image source={require('@/assets/images/default/fooddefault.jpg')} style={styles.image} />
            <Pressable onPress={handleGoBack} style={[styles.back, {backgroundColor: colors.white}]}>
                {theme === 'light' ?
                    <Image source={require('@/assets/images/back.png')} style={styles.icon} />
                :
                    <Image source={require('@/assets/images/backWhite.png')} style={styles.icon} />
                }
            </Pressable>
        </View>
        <View style={[styles.header, {backgroundColor: colors.white}]}>
            <Row>
                <View style={styles.wrapperBlock}>
                    <View style={styles.block}>
                        <ThemedText color={colors.black} style={[{borderColor: colors.black, fontSize: 12, fontWeight: '500'}]}>{filterUniqueFood?.calories} kcal</ThemedText>
                    </View>
                </View>
            </Row>
            <Row style={styles.wrapperTitle}>
                <ThemedText color={colors.black} variant="title" style={styles.title}>{filterUniqueFood?.title}</ThemedText>
                <ThemedText color={colors.black} style={[styles.subtitle, {borderColor: colors.grayDark}]} variant='title1'>{filterUniqueFood?.quantity + " " + filterUniqueFood?.unit}</ThemedText>
                <ThemedText color={colors.black} variant="title1" style={styles.title}>Good for diet - {filterUniqueFood?.calories} kcal</ThemedText>
            </Row>
            <View style={[styles.container]}>
                <Row gap={10}>
                    <NutritionStatCard
                        nutri={`proteins`}
                        quantity={filterUniqueFood?.proteins}
                        unit={'g'}
                        height={associatedValues["proteins"]}
                        source={require('@/assets/images/nutritional/meat.png')}
                    />
                    <NutritionStatCard
                        nutri={'carbs'}
                        quantity={filterUniqueFood?.carbs}
                        unit={'g'}
                        height={associatedValues["carbohydrates"]}
                        source={require('@/assets/images/nutritional/cutlery.png')}
                    />
                    <NutritionStatCard
                        nutri={'fats'}
                        quantity={filterUniqueFood?.fats}
                        unit={'g'}
                        height={associatedValues["fats"]}
                        source={require('@/assets/images/nutritional/water.png')}
                    />
                </Row>
            </View> 
            <View>

                {filterUniqueFood?.proteins ? <NutritionItem name={'Proteins'} quantity={filterUniqueFood?.proteins } unit={'g'}/> : null}
                {filterUniqueFood?.carbs ? <NutritionItem name={'Carbs'} quantity={filterUniqueFood?.carbs} unit={'g'}/> : null}
                {filterUniqueFood?.fats ? <NutritionItem name={'Fats'} quantity={filterUniqueFood?.fats}  unit={'g'}/> : null}
                
                {/* {filterUniqueFood?.vitaminA ? <NutritionItem name={'Vitamins A'} quantity={filterUniqueFood?.vitaminA} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminB1 ? <NutritionItem name={'Vitamins B1'} quantity={filterUniqueFood?.vitaminB1} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminB6 ? <NutritionItem name={'Vitamins B6'} quantity={filterUniqueFood?.vitaminB6} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminB12 ? <NutritionItem name={'Vitamins B12'} quantity={filterUniqueFood?.vitaminB12} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminC ? <NutritionItem name={'Vitamins C'} quantity={filterUniqueFood?.vitaminC} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminD ? <NutritionItem name={'Vitamins D'} quantity={filterUniqueFood?.vitaminD} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminE ? <NutritionItem name={'Vitamins E'} quantity={filterUniqueFood?.vitaminE} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminK ? <NutritionItem name={'Vitamins K'} quantity={filterUniqueFood?.vitaminK} unit={'g'}/> : null}
                {filterUniqueFood?.folate ? <NutritionItem name={'Folate'} quantity={filterUniqueFood?.folate} unit={'g'}/> : null}
            
                {filterUniqueFood?.potassium ? <NutritionItem name={'Potassium'} quantity={filterUniqueFood?.potassium} unit={'g'}/> : null}
                {filterUniqueFood?.magnesium ? <NutritionItem name={'Magnesium'} quantity={filterUniqueFood?.magnesium} unit={'g'}/> : null}
                {filterUniqueFood?.calcium ? <NutritionItem name={'Calcium'} quantity={filterUniqueFood?.calcium} unit={'g'}/> : null}
                {filterUniqueFood?.iron ? <NutritionItem name={'Iron'} quantity={filterUniqueFood?.iron} unit={'g'}/> : null} */}
            </View>
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: 'relative',
        width: '100%',
        height: 350
    },
    header: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        height: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        top: -35,
        
    },
    image: {
        objectFit: 'fill',
        width: '100%',
        height: 350
    },
    back: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 13,
        top: 100,
        left: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 25,
        height: 25
    },
    wrapperBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        marginTop: 40,
    },
    block: {
        borderWidth: 2,
        borderRadius: 7,
        padding: 8,
        width: 'auto',
        maxWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapperTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'column',
        overflow: "visible"
    },
    title: {
        height: 50,
    },
    subtitle : {
        marginBottom: 10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        marginTop: -20,
        paddingBottom: 40
    },
    delete: {
        height: 30,
        width: 30
    }
})