import { checkCaloriesBadges } from "@/functions/badgeFunctions";
import { calculateTotalCalories } from "@/functions/function";
import { setBadges } from "@/redux/slices/badgeSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// This is a single Expo + TypeScript React Native component that reproduces
// the badges page shown in the image. Styles try to mimic spacing, fonts
// and layout. You can drop this file into an Expo project and import
// <BadgeScreen /> in App.tsx.

type Badge = {
  id: string;
  title: string;
  date: string;
  value?: number; // numeric value for special center badge
  variant?: "small" | "large" | "circle";
};

const badges: Badge[] = [
  { id: "1", title: "Fitness God", date: "Feb 23, 2025", variant: "small" },
  { id: "2", title: "Max Sets", date: "Feb 23, 2025", value: 97, variant: "large" },
  { id: "3", title: "AI Enthusiast", date: "Feb 23, 2025", variant: "small" },
];

const progressBadges = [
  { id: "p1", title: "10 Day Streak", subtitle: "Open app for 10 days", percent: 60 },
  { id: "p2", title: "5,000 Calorie Burn", subtitle: "Burn 5K Calories total", percent: 32 },
];

const { width } = Dimensions.get("window");

export default function BadgeScreen() {

  const dispatch = useDispatch();
    const userRedux = useSelector((state: RootState) => state.user.user);
  const unlockedBadges = useSelector((state: RootState) => state.badges.unlocked);
  const [totalKcal, setTotalKcal] = useState(0);

  const normalizeDate = (date: any) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
};
// console.log("userderedux consume by days badge scrren : ", userRedux?.consumeByDays)
useEffect(() => {
  if (userRedux?.consumeByDays) {
    const dataConsumeByDays = Object.entries(userRedux.consumeByDays)
      .map(([day, value]) => {
        const normalized = normalizeDate(day);
        if (!normalized) return null; // skip invalid date
        return { day: normalized, value };
      })
      .filter(Boolean); // supprime les null

    const totalCalories = calculateTotalCalories(dataConsumeByDays);
    setTotalKcal(totalCalories)
    console.log("total calories", totalCalories);
    const unlocked = checkCaloriesBadges(totalCalories);

    dispatch(setBadges(unlocked));
  }
}, [userRedux, dispatch]);


  console.log(unlockedBadges);


  return (
    <SafeAreaView style={styles.safe}>
          <View>
      <Text>🎖 Badges Débloqués</Text>

      {unlockedBadges.length === 0 ? (
        <Text>Aucun badge pour le moment 😢</Text>
      ) : (
        <FlatList
          data={unlockedBadges}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Text>✅ {item}</Text>
          )}
        />
      )}
    </View>
      <View style={styles.container}>
        <Text style={styles.mainNumber}>81</Text>
        <Text>total calories : {totalKcal}</Text>
        <Text style={styles.subtitle}>Badges Unlocked</Text>

        {/* Badges row */}
        <View style={styles.badgeRow}>
          {badges.map((b, idx) => (
            <View key={b.id} style={styles.badgeWrapper}>
              {b.variant === "large" ? (
                <View style={styles.largeBadge}>
                  <View style={styles.largeBadgeInner}>
                    <Text style={styles.largeBadgeValue}>{b.value}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.smallBadge}>
                  {/* simple icon placeholder */}
                  <View style={styles.iconPlaceholder} />
                </View>
              )}

              <Text style={styles.badgeDate}>{b.date}</Text>
              <Text style={styles.badgeTitle}>{b.title}</Text>
            </View>
          ))}
        </View>

        {/* Next badge / progress cards */}
        <View style={styles.nextContainer}>
          <View style={styles.nextHeader}>
            <Text style={styles.nextTitle}>Your Next Badge</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={progressBadges}
            keyExtractor={(i) => i.id}
            style={{ marginTop: 12 }}
            renderItem={({ item }) => (
              <View style={styles.progressRow}>
                <View style={styles.progressLeft}>
                  <View style={styles.progressIconPlaceholder} />
                </View>
                <View style={styles.progressCenter}>
                  <Text style={styles.progressTitle}>{item.title}</Text>
                  <Text style={styles.progressSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.progressRight}>
                  <View style={styles.progressCircle}>
                    <Text style={styles.progressPercent}>{item.percent}%</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  mainNumber: {
    fontSize: 72,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    color: "#0A0A0A",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 4,
    fontSize: 16,
  },
  badgeRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgeWrapper: {
    width: (width - 40) / 3 - 6,
    alignItems: "center",
  },
  smallBadge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#F59E0B", // orange accent like the sample
  },
  iconPlaceholder: {
    width: 28,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  largeBadge: {
    width: 100,
    height: 120,
    borderRadius: 14,
    backgroundColor: "#111",
    borderWidth: 6,
    borderColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },
  largeBadgeInner: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  largeBadgeValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  badgeDate: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  badgeTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  nextContainer: {
    marginTop: 28,
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 18,
    padding: 12,
  },
  nextHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  nextTitle: { fontSize: 16, fontWeight: "700" },
  seeAll: { color: "#F59E0B", fontWeight: "700" },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  progressLeft: { width: 48, alignItems: "center" },
  progressIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EAEAEA",
  },
  progressCenter: { flex: 1, paddingHorizontal: 8 },
  progressTitle: { fontSize: 15, fontWeight: "700" },
  progressSubtitle: { color: "#777", marginTop: 4, fontSize: 13 },
  progressRight: { width: 56, alignItems: "center" },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercent: { fontWeight: "700" },
});
