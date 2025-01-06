import Row from '@/components/Row';
import { useTheme } from '@/hooks/ThemeProvider';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Pressable } from 'react-native';
import SubscriptionPage from '@/screens/Subscription/Subscription';

const Subscription = () => {
    const [selectedPlan, setSelectedPlan] = useState('Annual');
    const navigation = useNavigation()
    const { colors } = useTheme()

    const handleSubscription = () => {
        console.log(selectedPlan)
        Linking.openURL('https://buy.stripe.com/test_fZe5n70Ai4oZabK9AA')
        .catch((err) => console.error('Failed to open URL:', err));
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Take control of your nutrition journey.</Text>
            <Text style={styles.subtitle}>
                Unlock premium tools to optimize your health and achieve your goals faster.
            </Text>

            <View style={styles.features}>
                <Text style={styles.feature}>
                🥗 Create custom meals
                </Text>
                <Text style={styles.featureSubtitle}>
                    Design your own dishes tailored to your needs.
                </Text>
                <Text style={styles.feature}>
                🧬 Access all nutrients and macronutrients: 
                </Text>
                <Text style={styles.featureSubtitle}>
                    Keep track of everything you need for balanced nutrition.
                </Text>
                <Text style={styles.feature}>
                🚀 Reach new heights: 
                </Text>
                <Text style={styles.featureSubtitle}>
                    Push your limits and achieve incredible levels of health and fitness.
                </Text>
            </View>

            <Text style={styles.chooseText}>Choose the plan that suits you:</Text>

            <View style={styles.options}>
                <TouchableOpacity
                style={[
                    styles.option,
                    selectedPlan === 'Annual' && styles.selectedOption,
                ]}
                onPress={() => setSelectedPlan('Annual')}
                >
                    <Text style={styles.optionText}>Annual Plan</Text>
                    <Text style={[styles.discount,
                            selectedPlan === 'Annual' ? styles.annualDiscount : styles.annualPlanDiscount
                    ]}>33% SAVINGS</Text>
                    <Text style={styles.originalPrice}>$29.88</Text>
                    <Text style={styles.price}>$19.99</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[
                    styles.option,
                    selectedPlan === 'Monthly' && styles.selectedOption,
                ]}
                onPress={() => setSelectedPlan('Monthly')}
                >
                <Text style={styles.optionText}>Monthly</Text>
                <Text style={styles.price}>$2.49</Text>
                </TouchableOpacity>
            </View>

            {/* <Text style={styles.billingText}>
                Billing starts at the end of your free trial unless canceled. Plans renew automatically. Cancel via Google Play.
            </Text> */}
            <Row style={{marginTop: 20}} >
                <Pressable onPress={handleSubscription} style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    borderRadius: 4,
                    elevation: 3,
                    backgroundColor: colors.primary,
                    width: '100%'
                }}>
                    <Text style={{fontSize: 16,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    letterSpacing: 0.25,
                    color: colors.whiteFix,}}>Subscription</Text>
                </Pressable>
            </Row>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    features: {
        marginBottom: 20,
    },
    feature: {
        fontSize: 16,
        marginBottom: 10,
        marginTop: 20,
        fontWeight: 'bold'
    },
    featureSubtitle: {
        marginTop: -10,
        fontSize: 16
    },
    chooseText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    options: {
        marginBottom: 20,
    },
    option: {
        // borderWidth: 1,
        // borderColor: '#ccc',
        backgroundColor: '#EEF2FF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedOption: {
        borderColor: '#ccc',
        backgroundColor: '#8592F2',
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    discount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 14,
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
    billingText: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    button: {
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        height: '100%',
    },
    annualDiscount: {
        color: 'white',
    },
    annualPlanDiscount: {
        color: '#a1a1d7',
    },
});

export default Subscription;
