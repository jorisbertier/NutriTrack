
import { useTranslation } from "react-i18next";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/hooks/ThemeProvider";
import React, { useEffect, useRef, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ViewStyle,
    TextStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
    basalMetabolicRate: number;
    totalKcalConsumeToday: number;
    remaining?: number;
    size?: number;
    strokeWidth?: number;
    isLoading?: boolean;
    showIcon: boolean;
    duration?: number;
    style?: ViewStyle;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const DailyIntakeCard: React.FC<Props> = ({
    basalMetabolicRate,
    totalKcalConsumeToday,
    remaining,
    size = 136,
    strokeWidth = 12,
    isLoading = false,
    showIcon,
    duration = 900,
    style,
    // bgColor = "#E8F9C9", // card background
}) => {

    const { colors } = useTheme();
    
    const safeGoal = Math.max(1, Math.round(basalMetabolicRate || 0));
    const current = Math.max(0, Math.round(totalKcalConsumeToday || 0));

    const percentage = Math.min((current / safeGoal) * 100, 100);

    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const animated = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animated, {
        toValue: percentage,
        duration,
        useNativeDriver: false, // strokeDashoffset isn't supported by native driver
        }).start();
    }, [percentage, duration, animated]);

    // interpolate strokeDashoffset from animated percent
    const strokeDashoffset = animated.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    // rounded integer percent for display (not animated)
    const displayPercent = Math.round(percentage);

    return (
        <View style={[styles.card, { backgroundColor: colors.blueLight }, style]}>
            {/* Left: title + big percent */}
            <View style={styles.left}>
                <View style={styles.titleRow}>
                    <View style={styles.iconCircle}>
                        {/* <Text style={styles.iconText}>⚡</Text> */}
                        <Text style={styles.iconText}>{showIcon && '🎯'}</Text>
                    </View>
                    <Text style={[styles.titleText, { color: colors.black }]}>
                        Daily intake
                    </Text>
                </View>

                <Text style={[styles.bigPercent, { color: colors.black }]}>
                {displayPercent}%
                </Text>
            </View>

            {/* Right: circular progress */}
            <View style={styles.right}>
                <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
                <Svg width={size} height={size}>
                    {/* subtle full-track circle */}
                    <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.white}
                    strokeWidth={10}
                    fill="none"
                    />

                    {/* animated progress circle */}
                    <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.black}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    // @ts-ignore: animated interpolation is ok here
                    strokeDashoffset={strokeDashoffset}
                    rotation="-90"
                    origin={`${center}, ${center}`}
                    fill="none"
                    />
                </Svg>

                {/* Inner white disc to create the donut look */}
                <View
                    style={[
                    styles.innerCircle,
                    {
                        width: size - strokeWidth * 2.2,
                        height: size - strokeWidth * 2.2,
                        borderRadius: (size - strokeWidth * 2.2) / 2,
                    },
                    ]}
                />

                {/* Center texts (current / goal) */}
                <View style={styles.centerTextContainer}>
                    <Text style={[styles.centerCurrent, { color: colors.black }]}>
                    {current}
                    </Text>
                    <View style={styles.centerDivider} />
                    <Text style={[styles.centerGoal, { color: colors.black }]}>
                    {safeGoal}
                    </Text>
                </View>
                </View>
            </View>

            {/* small badge showing remaining if provided */}
            {typeof remaining === "number" && remaining > 0 &&(
                <View style={[styles.badge, { backgroundColor: colors.grayMode }]}>
                    <Text style={[styles.badgeText, { color: colors.black }]}>
                        {Math.round(remaining)} kcal left
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 25,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: -70,
        marginBottom: 25
    },
    left: {
        flex: 1,
        paddingRight: 8,
        marginLeft: 10,
        gap: 10
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    iconText: {
        fontSize: 14,
    },
    titleText: {
        fontWeight: "500",
        letterSpacing: 1,
        fontSize: 16
    } as TextStyle,
    bigPercent: {
        marginTop: 10,
        fontSize: 48,
        fontWeight: "800",
        lineHeight: 48,
    } as TextStyle,
    right: {
        width: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    innerCircle: {
        position: "absolute",
        backgroundColor: "#fff",
    },
    centerTextContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    centerCurrent: {
        fontSize: 16,
        fontWeight: "600",
    },
    centerGoal: {
        fontSize: 16,
        color: "#121212ff",
        marginTop: 2,
        fontWeight: "500",
    },
    centerDivider: {
        width: 36,
        height: 1,
        backgroundColor: "#d6d6d6",
        marginVertical: 4,
    },
    badge: {
        position: "absolute",
        right: 12,
        top: -18,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
});