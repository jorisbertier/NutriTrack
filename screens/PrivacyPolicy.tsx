import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

const PrivacyPolicy = () => {
    return (
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.date}>Effective Date:  January 2, 2025</Text>
        </View>

        <View style={styles.content}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
            We may collect the following types of information:
            {'\n\n'}
            - Personal Information: Information that can be used to identify you, such as your name, email address, phone number, and other similar identifiers.
            {'\n\n'}
            - Usage Data: Information about how you interact with our App, such as your device type, operating system, IP address, browser type, and usage patterns.
            {/* {'\n\n'}
            - Location Data: If you allow our App to access your location, we may collect location data to enhance your user experience. */}
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
            We use the information we collect for various purposes, including:
            {'\n\n'}
            - To provide and improve our App
            {'\n\n'}
            - To personalize your experience
            {'\n\n'}
            - To communicate with you, including sending promotional materials or customer service inquiries
            {'\n\n'}
            - To analyze App usage and improve our services
            </Text>

            <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
            <Text style={styles.sectionText}>
            We do not sell, trade, or otherwise transfer your personal information to outside parties unless we have your consent or are required by law. However, we may share your information with:
            {'\n\n'}
            - Service Providers: Trusted third-party providers who assist us in operating our App or conducting business.
            {'\n\n'}
            - Legal Requirements: If required by law or to protect the rights, property, or safety of our users or the public, we may disclose your information.
            </Text>

            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
            We take reasonable measures to protect the security of your information. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
            </Text>

            <Text style={styles.sectionTitle}>5. Your Choices</Text>
            <Text style={styles.sectionText}>
            - Access and Update Information: You can review and update your personal information through the App settings or by contacting us.
            {'\n\n'}
            - Opt-out: You can opt out of promotional emails by clicking the unsubscribe link in the email or adjusting your preferences in the App.
            </Text>

            <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
            <Text style={styles.sectionText}>
            Our App is not intended for children under the age of 5. We do not knowingly collect personal information from children. If you believe we have collected personal information from a child, please contact us, and we will take steps to delete such information.
            </Text>

            <Text style={styles.sectionTitle}>7. Changes to This Privacy Policy</Text>
            <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.sectionText}>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
            {'\n\n'}
            Nutrition Track{'\n'}
            Email : nutritiontrack.help@gmail.com{'\n'}
            Whatsapp: +3368594525
            </Text>
        </View>

        <View style={styles.buttonContainer}>
            <Button title="Close" onPress={() => console.log('Closing Privacy Policy')} />
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
    },
    content: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
    },
    sectionText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#444',
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
});

export default PrivacyPolicy;