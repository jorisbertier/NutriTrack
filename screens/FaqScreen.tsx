import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question: 'Comment ajouter un aliment ?',
    answer: 'Appuyez sur le bouton "+" pour ajouter un nouvel aliment à votre base.',
  },
  {
    question: 'Puis-je modifier un aliment existant ?',
    answer: 'Oui, allez dans la liste, sélectionnez un aliment, puis cliquez sur "Modifier".',
  },
  {
    question: 'Mes données sont-elles sauvegardées ?',
    answer: 'Toutes vos données sont stockées de manière sécurisée sur Firebase.',
  },
];

const FaqScreen = () => {
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
              <Text style={styles.question}>{item.question}</Text>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Ionicons name="chevron-down" size={22} color="#333" />
              </Animated.View>
            </TouchableOpacity>

            {expanded[index] && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{item.answer}</Text>
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
