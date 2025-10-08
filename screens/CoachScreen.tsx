import BetaBadge from "@/components/BadgeBeta";
import HelpCoachButton from "@/components/HelpCoachButton";
import { BasalMetabolicRate, calculAge, calculCarbohydrates, calculFats, calculProteins, fetchUserDataConnected, getTodayDate } from "@/functions/function";
import { User } from "@/interface/User";
import { RootState } from "@/redux/store";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Rive from 'rive-react-native';
import {nutritionAdvices} from '../data/advices';
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const CoachScreen = () => {

  const { t } = useTranslation();

    const [adviceIndex, setAdviceIndex] = useState(0);
    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;
    const date = getTodayDate();
    /*convert date */
    const [adviceList, setAdviceList] = useState<string[]>([]);

    // REDUX
    const dispatch = useDispatch();
    const userRedux = useSelector((state: RootState) => state.user.user);
    const unlockedBadges = useSelector((state: RootState) => state.badges.unlocked);

    console.log('date ', date)

    useEffect(() => {
        const fetchData = async () => {
            try {
                fetchUserDataConnected(user, setUserData)
            }
            catch (e) {
                console.log('Error processing data', e);
            }
        }
        fetchData();
    }, []);

    /* ALL DATAS ONE USER */
        const basalMetabolicRate = userData.length > 0 ? BasalMetabolicRate(
        Number(userData[0]?.weight),
        Number(userData[0]?.height),
        Number(calculAge(userData[0]?.dateOfBirth)),
        userData[0]?.gender,
        userData[0]?.activityLevel
    ) : null;


    const proteinsBmr = calculProteins(Number(userData[0]?.weight));
    const carbsBmr =calculCarbohydrates(basalMetabolicRate);
    const fatsBmr = calculFats(basalMetabolicRate);
    const [dd, mm, yyyy] = date.split("/");

    const dateYMD = `${yyyy}-${mm}-${dd}`;
    const dateDmyDash = `${dd}-${mm}-${yyyy}`;
    const carbsToday = userRedux?.carbsTotal?.[dateYMD] ?? 0;
    const proteinsToday = userRedux?.proteinsTotal?.[dateYMD] ?? 0;
    const fatsToday = userRedux?.fatsTotal?.[dateYMD] ?? 0;
    const caloriesToday = userRedux?.consumeByDays?.[dateYMD] ?? 0;
    const xpToday = userData[0]?.xpLogs?.[dateDmyDash] ?? 0;

    // console.log(date)
    // console.log('activity', userData[0]?.activityLevel);
    // console.log('goal gain | maintain | lose', userData[0]?.goal)
    // console.log('bmr', basalMetabolicRate)
    // console.log("Carbs du jour :", carbsToday);
    // console.log("Protéines du jour :", proteinsToday);
    // console.log("Graisses du jour :", fatsToday);
    // console.log("Calories du jour :", caloriesToday);
    // console.log("XP du jour :", xpToday);
    // console.log("proteins by day :", proteinsBmr);
    // console.log("carbs by day :", carbsBmr);
    // console.log("fats by days :", fatsBmr);

    const mood = getMascotMood({
        caloriesToday,
        caloriesTarget: Number(basalMetabolicRate),
        proteinsToday,
        proteinsTarget: proteinsBmr,
        carbsToday,
        carbsTarget: carbsBmr,
        fatsToday,
        fatsTarget: fatsBmr,
        goal: (userData[0]?.goal ?? "maintain") as "gain" | "lose" | "maintain",
        xpToday
    });

    useEffect(() => {
        const advices = getAdvice({
            caloriesToday,
            proteinsToday,
            carbsToday,
            fatsToday,
            caloriesTarget: basalMetabolicRate,
            proteinsTarget: proteinsBmr,
            carbsTarget: carbsBmr,
            fatsTarget: fatsBmr,
            goal: userData[0]?.goal,
            xpToday,
            mood
        });
        setAdviceList(advices);
    }, [caloriesToday, proteinsToday, carbsToday, fatsToday, xpToday, mood]);

      const riveSources: Record<string, any> = {
        happy: require("../assets/rive/monkey_happy.riv"),
        sad: require("../assets/rive/monkey_sad.riv"),
        angry: require("../assets/rive/monkey_angry.riv"),
        motivated: require("../assets/rive/monkey_motivated.riv"),
        neutral: require("../assets/rive/monkey_sad.riv"),
        test: require("../assets/rive/monkey_profil_picture.riv"),
      };

    return (
        <View style={styles.container}>
        {/* Bulle de conversation */}
        <BetaBadge/>
        <HelpCoachButton/>
        <View style={styles.adviceContainer}>
            <Text style={styles.adviceText}>{adviceList[0] ? t(adviceList[0]) : ""}</Text>
            <View style={styles.triangle} />
            <Text>Consume today : {caloriesToday}</Text>
            <Text>Consume today proteins: {proteinsToday}</Text>
            <Text>Consume today fats: {fatsToday}</Text>
            <Text>Consume today varbs: {carbsToday}</Text>
        </View>

        {/* Animation en bas */}
        <View style={styles.animationContainer}>
        <Rive
          source={riveSources[mood]}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
        </View>

        <Text>{mood}</Text>
        </View>
    );
};

type AdviceResult = {
    message: string;
    status: "low" | "ok" | "high";
};



function randomPick(arr?: string[]) {
  if (!arr || arr.length === 0) return "Aucun conseil disponible 😅";
  return arr[Math.floor(Math.random() * arr.length)];
}


function getAdvice({
    caloriesToday,
    proteinsToday,
    carbsToday,
    fatsToday,
    caloriesTarget,
    proteinsTarget,
    carbsTarget,
    fatsTarget,
    goal,
    xpToday,
    mood
}: any) {
    const advices: string[] = [];

    if (caloriesToday === 0) {
        advices.push(randomPick(nutritionAdvices.moods["neutral"]))
    }

    if (caloriesToday > caloriesTarget + 500) {
        advices.push(randomPick(nutritionAdvices.moods["angry"]))
    }

    if (caloriesToday > caloriesTarget) {
        advices.push(randomPick(nutritionAdvices.moods["happy"]))
    }

    if (caloriesToday >= caloriesTarget * 0.3 && caloriesToday <= caloriesTarget) {
        advices.push(randomPick(nutritionAdvices.moods["motivated"]))
    }

  // Calories
  // if (caloriesToday < caloriesTarget * 0.9) advices.push(randomPick(nutritionAdvices.calories.low));
  // else if (caloriesToday > caloriesTarget * 1.1) advices.push(randomPick(nutritionAdvices.calories.high));
  // else advices.push(randomPick(nutritionAdvices.calories.ok));

  // // Protéines
  // if (proteinsToday < proteinsTarget * 0.8) advices.push(randomPick(nutritionAdvices.proteins.low));
  // else advices.push(randomPick(nutritionAdvices.proteins.ok));

  // // Glucides
  // if (carbsToday > carbsTarget * 1.2) advices.push(randomPick(nutritionAdvices.carbs.high));
  // else if (carbsToday < carbsTarget * 0.8) advices.push(randomPick(nutritionAdvices.carbs.low));
  // else advices.push(randomPick(nutritionAdvices.carbs.ok));

  // // Graisses
  // if (fatsToday > fatsTarget * 1.2) advices.push(randomPick(nutritionAdvices.fats.high));
  // else if (fatsToday < fatsTarget * 0.8) advices.push(randomPick(nutritionAdvices.fats.low));

  // // XP
  // if (xpToday === 0) advices.push(randomPick(nutritionAdvices.xp.zero));
  // else advices.push(randomPick(nutritionAdvices.xp.positive));

  // // Goal
  // advices.push(randomPick(nutritionAdvices.encouragements[goal]));

  // // Mood de la mascotte
  // advices.push(randomPick(nutritionAdvices.moods[mood]));

  return advices;
}

type Mood = "happy" | "sad" | "angry" | "motivated" | "neutral";

function getMascotMood({
    caloriesToday,
    caloriesTarget,
    proteinsToday,
    proteinsTarget,
    carbsToday,
    carbsTarget,
    fatsToday,
    fatsTarget,
    goal,
    xpToday
}: {
    caloriesToday: number;
    caloriesTarget: number;
    proteinsToday: number;
    proteinsTarget: number;
    carbsToday: number;
    carbsTarget: number;
    fatsToday: number;
    fatsTarget: number;
    goal: "gain" | "lose" | "maintain";
    xpToday: number;
}): Mood {

    // if (caloriesToday < caloriesTarget * 0.9 || proteinsToday < proteinsTarget * 0.8) {
    //     return "sad";
    // }
    if (caloriesToday === 0) {
        return "neutral";
    }

    if (caloriesToday > caloriesTarget + 500) {
        return "angry";
    }

    if (caloriesToday > caloriesTarget) {
        return "happy";
    }

    if (caloriesToday >= caloriesTarget * 0.3 && caloriesToday <= caloriesTarget) {
        return "motivated";
    }

    // if (caloriesToday > caloriesTarget * 1.1 || carbsToday > carbsTarget * 1.2 || fatsToday > fatsTarget * 1.2) {
    //     return "angry";
    // }

    // if (
    //     caloriesToday >= caloriesTarget * 0.9 &&
    //     caloriesToday <= caloriesTarget * 1.1 &&
    //     proteinsToday >= proteinsTarget * 0.8 &&
    //     carbsToday >= carbsTarget * 0.8 &&
    //     fatsToday >= fatsTarget * 0.8 &&
    //     xpToday > 0
    // ) {
    //     return "happy";
    // }

    // if (goal === "gain" && caloriesToday >= caloriesTarget * 0.9) return "motivated";
    // if (goal === "lose" && caloriesToday <= caloriesTarget * 1.1) return "motivated";
    // if (goal === "maintain" && Math.abs(caloriesToday - caloriesTarget) <= caloriesTarget * 0.1) return "motivated";

    return "neutral";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // alignItems: "center",
    justifyContent: "flex-end", // pousse tout vers le bas
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  adviceContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 15,
    maxWidth: width * 0.8,
    position: "absolute",
    top: 200,
    height: 100,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  triangle: {
    position: "absolute",
    bottom: -12,
    left: "50%",
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFF",
  },
  adviceText: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
    marginTop: -60,
    fontWeight: 600
  },
  animationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF7F50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CoachScreen;
