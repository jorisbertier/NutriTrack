import { capitalizeFirstLetter } from '@/functions/function'
import React, { useRef } from 'react'
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { useTheme } from '@/hooks/ThemeProvider'
import { useTranslation } from 'react-i18next'

type DayCarouselProps = {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    handleOpenCalendar: () => void;
};

const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    es: 'es-ES',
    en: 'en-US',
};

export const DayCarousel: React.FC<DayCarouselProps> = ({
    selectedDate,
    setSelectedDate,
    handleOpenCalendar,
}) => {

    const { colors } = useTheme();
    const { i18n } = useTranslation();
    const locale = localeMap[i18n.language] || 'en-US';

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    // Fonction pour animer le glissement du jour
    const animateChange = (newDate: Date) => {
        Animated.sequence([
            Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 10,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            ]),
            Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            ]),
        ]).start(() => setSelectedDate(newDate));

    };
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        animateChange(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        animateChange(newDate);
    };

    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    
    return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: colors.whiteMode,
                }}
            >
                <TouchableOpacity
                    onPress={goToPreviousDay}
                    activeOpacity={0.6}
                    style={{
                    backgroundColor: colors.grayMode,
                    width: "25%",
                    height: 80,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.6,
                    }}
                >
                    <ThemedText variant="title3" color={colors.black} style={{ fontSize: 12 }}>
                    {capitalizeFirstLetter(previousDay.toLocaleString(locale, { weekday: "short" }))}
                    </ThemedText>
                    <Text style={{ fontSize: 18, fontWeight: "500", color: colors.black }}>{previousDay.getDate()}</Text>
                </TouchableOpacity>

                {/* Jour sélectionné (animé) */}
                <Animated.View
                    style={{
                    width: "30%",
                    height: 80,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.blueLight,
                    transform: [{ translateY }],
                    opacity: fadeAnim,
                    }}
                >
                    <TouchableOpacity onPress={handleOpenCalendar}>
                        <View style={{ alignItems: "center", gap: 3 }}>
                            <ThemedText
                            variant="title3"
                            color={colors.blackFix}
                            style={{ fontSize: 12, textAlign: "center" }}
                            >
                            {capitalizeFirstLetter(selectedDate.toLocaleString(locale , { weekday: "short" }))}
                            </ThemedText>
                            <Text style={{ fontSize: 20, fontWeight: "600", textAlign: "center" }}>
                            {selectedDate.getDate()}
                            </Text>
                            <Text
                            style={{ fontSize: 16, textAlign: "center", fontWeight: "500", color: colors.blackFix }}
                            >
                            {capitalizeFirstLetter(nextDay.toLocaleString(locale, { month: "short" }))}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Jour suivant */}
                <TouchableOpacity
                    onPress={goToNextDay}
                    activeOpacity={0.6}
                    style={{
                    backgroundColor: colors.grayMode,
                    width: "25%",
                    height: 80,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.6,
                    }}
                >
                    <ThemedText variant="title3" color={colors.black} style={{ fontSize: 12 }}>
                    {capitalizeFirstLetter(nextDay.toLocaleString(locale, { weekday: "short" }))}
                    </ThemedText>
                    <Text style={{ fontSize: 18, fontWeight: "500", color: colors.black }}>{nextDay.getDate()}</Text>
                </TouchableOpacity>
            </View>
    )
}
