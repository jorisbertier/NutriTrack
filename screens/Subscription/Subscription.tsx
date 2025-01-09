import Row from '@/components/Row';
import { useTheme } from '@/hooks/ThemeProvider';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Pressable, Modal } from 'react-native';
import SubscriptionPage from '@/screens/Subscription/Subscription';
import { WebView } from 'react-native-webview';

const Subscription = () => {
    const [selectedPlan, setSelectedPlan] = useState('Annual');
    const [isWebViewVisible, setIsWebViewVisible] = useState(false);
    const { colors } = useTheme()
    console.log(selectedPlan)
    // const handleSubscription = () => {
    //     console.log(selectedPlan)
    //     Linking.openURL('https://buy.stripe.com/test_fZe5n70Ai4oZabK9AA')
    //     .catch((err) => console.error('Failed to open URL:', err));
    // }
    const handleSubscription = () => {
        setIsWebViewVisible(true);
    };
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
                {/* Option 1 */}
                <TouchableOpacity
                    style={[styles.option,
                    selectedPlan == 'Annual' && styles.selectedOption]}
                    onPress={() => setSelectedPlan('Annual')}
                >
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>37% Savings</Text>
                    </View>
                    <View style={styles.content}>
                    <View>
                        <Text style={styles.duration}>Annual</Text>
                        <Text style={styles.price}>
                        <Text style={styles.strikeThrough}>23,88 €</Text> 14,99 €
                        </Text>
                    </View>
                    <Text style={styles.monthlyPrice}>14,99 €/year</Text>
                    </View>
                </TouchableOpacity>

                {/* Option 2 */}
                <TouchableOpacity
                    style={[styles.option,
                    selectedPlan == 'Monthly' && styles.selectedOption]}
                    onPress={() => setSelectedPlan('Monthly')}
                >
                    
                    <View style={styles.content}>
                    <View>
                        <Text style={styles.duration}>Monthly</Text>
                        {/* <Text style={styles.price}>23,99 €</Text> */}
                    </View>
                    <Text style={styles.monthlyPrice}>1,99 €/month</Text>
                    </View>
                </TouchableOpacity>

            {/* <Text style={styles.billingText}>
                Billing starts at the end of your free trial unless canceled. Plans renew automatically. Cancel via Google Play.
            </Text> */}
            <Row style={{marginTop: 20}} >
                <Pressable onPress={handleSubscription} style={[ styles.button, { backgroundColor: colors.primary}]}>
                    <Text style={[styles.buttonText, { color: colors.whiteFix }]}>Subscription</Text>
                </Pressable>
            </Row>
            <Modal visible={isWebViewVisible} animationType="slide">
                <View style={{ flex: 1 }}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => setIsWebViewVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                    {selectedPlan != 'Annual' ?
                    <WebView
                        source={{
                            uri: 'https://buy.stripe.com/test_fZe5n70Ai4oZabK9AA',
                        }}
                        startInLoadingState
                    />
                    :
                    <WebView
                        source={{
                            uri: 'https://buy.stripe.com/test_00gcPz6YGdZzcjS6op',
                        }}
                        startInLoadingState
                    />
                    }
                </View>
            </Modal>
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
    option: {
        position: 'relative',
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        borderTopWidth: 1,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#ddd',
        borderBottomWidth: 5,
    },
    selectedOption: {
        backgroundColor: '#f5eafe',
        borderColor: '#a1a1d7',
    },
    labelContainer: {
        position: 'absolute',
        top: 5,
        right: 10,
        backgroundColor: '#a1a1d7',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        zIndex: 10
    },
    label: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    duration: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
        strikeThrough: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
        monthlyPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    billingText: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        elevation: 3,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Subscription;
