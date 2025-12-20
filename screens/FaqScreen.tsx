import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type FaqItem = {
  key: string;
};

const faqData: FaqItem[] = [
  { key: 'faq_add_food' },
  { key: 'faq_avatar' },
  { key: 'faq_goal_icon' },
  { key: 'faq_update_weight' },
  { key: 'faq_mascot_bmi' },
  { key: 'faq_xp' },
  { key: 'faq_modify_food' },
  { key: 'faq_gram_precision' },
  { key: 'faq_custom_food' },
  { key: 'faq_food_database' },
  { key: 'faq_data_saved' },
  { key: 'faq_delete_food' },
  { key: 'faq_modify_goals' },
  { key: 'faq_technical_issue' },
];

const FaqScreen = () => {

  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<boolean[]>(faqData.map(() => false));
  const rotationAnim = useRef<Animated.Value[]>(faqData.map(() => new Animated.Value(0))).current;

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);

    Animated.timing(rotationAnim[index], {
      toValue: newExpanded[index] ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {faqData.map((item, index) => {
        const rotate = rotationAnim[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        });

        return (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleExpand(index)}
              style={styles.header}
            >
              <Text style={styles.question}>{t(`${item.key}.question`)}</Text>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Ionicons name="chevron-down" size={22} color="#333" />
              </Animated.View>
            </TouchableOpacity>

            {expanded[index] && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{t(`${item.key}.answer`)}</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    flex: 1,
    paddingRight: 12,
  },
  answerContainer: {
    marginTop: 10,
  },
  answer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
