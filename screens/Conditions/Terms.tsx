import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';

const Terms = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Terms of Service for Nutrition Track Application</Text>
            <Text style={styles.date}>Last updated: January 2, 2025</Text>
        
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
                Welcome to Nutrition Track! By using our application, you agree to these Terms of Service. If you do not agree with these terms, please do not use the application.
                We reserve the right to modify or update these terms at any time. It is your responsibility to review this page regularly for any changes. Your continued use of the application after any changes will constitute your acceptance of the new terms.
            </Text>
        
            <Text style={styles.sectionTitle}>2. Application Description</Text>
            <Text style={styles.text}>
                Nutrition Track is an application designed to help you track your eating habits, monitor your calorie intake, macronutrients, and achieve your health and nutrition goals.
                The app allows you to track the foods you consume, view nutritional data, set goals, and analyze your progress.
            </Text>
        
            <Text style={styles.sectionTitle}>3. Use of the Application</Text>
            <Text style={styles.text}>
                You agree to use the application legally and in accordance with all applicable laws. You agree not to use the application in any abusive manner or to harm its functionality.
                You are responsible for the confidentiality of your personal information and for managing your account.
            </Text>
        
            <Text style={styles.sectionTitle}>4. Registration and User Account</Text>
            <Text style={styles.text}>
                To access certain features of the application, you will need to create a user account. You must provide accurate and complete information during registration. It is your responsibility to maintain the confidentiality of your login credentials and prevent unauthorized access to your account.
            </Text>
        
            <Text style={styles.sectionTitle}>5. Data Collection and Use</Text>
            <Text style={styles.text}>
                The application collects certain personal data to function properly, such as information related to your nutrition, eating habits, and your user account details.
                Please refer to our Privacy Policy for more information on how we collect, use, and protect your personal data.
            </Text>
        
            <Text style={styles.sectionTitle}>6. Application Content</Text>
            <Text style={styles.text}>
                The application may contain nutritional information, health tips, and suggestions, but this content is for informational purposes only. Always consult a healthcare professional before making decisions related to your nutrition, health, or well-being.
            </Text>
        
            <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
            <Text style={styles.text}>
                All intellectual property rights related to the content, features, and design of the application, including but not limited to logos, graphics, icons, and source code, are the exclusive property of [Company Name]. You agree not to reproduce, modify, distribute, or otherwise use any elements of the application without prior permission.
            </Text>
        
            <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
            <Text style={styles.text}>
                The application is provided "as is," and we do not guarantee that it will be free from errors or bugs. We are not responsible for any direct or indirect damages resulting from the use of the application, including data loss, calculation errors, or health-related issues.
            </Text>
        
            <Text style={styles.sectionTitle}>9. Modifications and Termination</Text>
            <Text style={styles.text}>
                We reserve the right to suspend, modify, or remove any features of the application at any time, without notice. You may terminate your account at any time by contacting us. We may also suspend or terminate your access to the application if you violate these Terms of Service.
            </Text>
        
            <Text style={styles.sectionTitle}>10. External Links</Text>
            <Text style={styles.text}>
                The application may contain links to third-party websites. These links are provided for informational purposes only, and we are not responsible for the content or privacy practices of these websites.
            </Text>
        
            <Text style={styles.sectionTitle}>11. Governing Law and Data Storage</Text>
            <Text style={styles.text}>
            By using this app, you agree that the laws of France will govern any disputes or issues arising from the use of this app. Although we operate in France, the data you provide may be stored and processed in various Google Cloud servers located in different regions, including outside of the European Union. We comply with all applicable data protection regulations, including the General Data Protection Regulation (GDPR), and take necessary steps to ensure that your data is handled securely and in accordance with these laws.
            </Text>
        
            <Text style={styles.sectionTitle}>12. Contact</Text>
            <Text style={styles.textContact}>
                If you have any questions regarding these Terms of Service, please contact us at:
                {"\n"}nutritiontrack.help@gmail.com
                {/* {"\n"}[Physical address, if applicable] */}
            </Text>
            </ScrollView>
        );
    };
    
const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    date: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 20,
        color: 'gray',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    text: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    textContact: {
        fontSize: 14,
        marginBottom: 100,
        lineHeight: 20,
    },
});
export default Terms;