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
    answer: 'Sélectionnez le jour souhaité, puis appuyez sur le bouton « + » pour ajouter un nouvel aliment. Choisissez ensuite le repas auquel l’aliment doit être associé.',
  },
  {
    question: 'Pourquoi ne puis-je pas modifier mon avatar ?',
    answer: 'La customisation de l\'avatar est une fonctionnalité réservée aux utilisateurs premium. Abonnez-vous pour débloquer cette option.',
  },
  {
    question: "Que signifie l’icône objectif 🎯",
    answer: 'L’icône 🎯 indique que votre objectif nutritionnel quotidien a été ajusté. Cela signifie que la répartition de vos macronutriments a été modifiée afin d’augmenter ou de diminuer votre apport calorique par rapport à votre objectif journalier.',
  },
  {
    question: "Pourquoi dois-je mettre à jour mon poids régulièrement ?",
    answer: 'Mettre à jour votre poids régulièrement permet d’assurer un suivi plus précis de votre évolution et d’ajuster correctement vos objectifs nutritionnels. Un poids à jour garantit des calculs plus fiables concernant vos besoins caloriques et vos macronutriments, pour un suivi réellement personnalisé.',
  },
  {
    question: "Pourquoi la mascotte a-t-elle le même IMC que moi ?",
    answer: 'La mascotte reflète votre IMC (Indice de Masse Corporelle) afin de représenter visuellement votre progression. Elle évolue en fonction de vos données personnelles, ce qui permet de rendre votre suivi plus intuitif et motivant.',
  },
  {
    question: "Je n’ai pas gagné d’expérience après avoir rempli mes objectifs journaliers, pourquoi ?",
    answer: 'Le gain d’expérience est limité à 20 XP par jour pour la journée en cours. Si vous complétez vos objectifs pour un jour passé (hier ou une autre date), aucun point d’expérience ne sera attribué. Pour gagner de l’expérience, assurez-vous également que votre consommation calorique du jour actuel correspond bien à l’objectif défini (ni trop en dessous). Une fois la condition remplie, l’expérience est automatiquement ajoutée.',
  },
  {
    question: "Puis-je modifier un aliment déjà ajouté ?",
    answer: 'La modification d’un aliment déjà ajouté n’est pas encore disponible. Pour effectuer un changement, vous devez supprimer l’aliment concerné, puis l’ajouter de nouveau avec les valeurs souhaitées.',
  },
  {
    question: 'Pourquoi ne puis-je pas ajouter un aliment au gramme près ?',
    answer: 'L’ajout d’aliments avec une précision au gramme près est une fonctionnalité réservée aux utilisateurs Premium. Sans abonnement, les quantités sont proposées sous forme de portions prédéfinies.',
  },
  {
    question: 'Puis-je créer mes propres aliments personnalisés ?',
    answer: 'La création d’aliments personnalisés est exclusivement réservée aux abonnés Premium. Cette fonctionnalité permet d’ajouter vos propres aliments avec leurs valeurs nutritionnelles exactes.',
  },
  {
    question: 'Pourquoi certains aliments ne sont-ils pas disponibles dans la base de données ?',
    answer: 'La base de données nutritionnelle est régulièrement mise à jour. Il est possible que certains aliments spécifiques ou locaux ne soient pas encore référencés. Dans ce cas, les utilisateurs Premium peuvent créer un aliment personnalisé.',
  },
  {
    question: 'Mes données sont-elles sauvegardées ?',
    answer: 'Oui. Toutes vos données sont sauvegardées de manière sécurisée, garantissant leur confidentialité et leur protection.',
  },
  {
    question: 'Puis-je supprimer un aliment ajouté par erreur ?',
    answer: 'Oui. Vous pouvez supprimer un aliment à tout moment en le retirant du repas auquel il a été ajouté.',
  },
  {
    question: 'Puis-je modifier mes objectifs nutritionnels ?',
    answer: 'Oui. Vous pouvez modifier vos objectifs nutritionnels à tout moment depuis les paramètres. Toute modification impactera immédiatement vos objectifs journaliers et le suivi de vos macronutriments.',
  },
  {
    question: 'Je rencontre un problème technique, que faire ?',
    answer: 'Contactez notre support via la section "Contact support" dans les paramètres de l\'application pour obtenir de l\'aide.',
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
