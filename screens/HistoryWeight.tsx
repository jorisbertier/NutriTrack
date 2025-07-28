import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    ActivityIndicator,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { useTheme } from '@/hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { fetchUserDataConnected } from '@/functions/function';
import { User } from '@/interface/User';

const HistoryWeight = () => {

    const { colors } = useTheme();
    const { t } = useTranslation();
    const auth = getAuth();
    const user = auth.currentUser;

    const [userData, setUserData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            await fetchUserDataConnected(user, setUserData);
        } catch (error) {
            setErrorMessage(t('error_data_user'));
        } finally {
            setIsLoading(false);
            setErrorMessage('');
        }
        };
        fetchData();
    }, []);

    const weightLog = userData[0]?.weightLog || [];

    const sortedLog = [...weightLog].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.white }]}>
            {errorMessage && <Text style={{color: 'red', textAlign: 'center', marginBottom: 10}}>{errorMessage}</Text>}
        {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : sortedLog.length === 0 ? (
            <Text style={[styles.noData, { color: colors.textSecondary }]}>
            {t('no_weight_data')} .
            </Text>
        ) : (
            <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            >
            {sortedLog.map((log, index) => (
                <View
                key={index}
                style={[styles.card, { backgroundColor: colors.gray}]}
                >
                <Text style={[styles.cardText, { color: colors.text }]}>
                    {log.date}
                </Text>
                <Text style={[styles.weightText, { color: colors.black }]}>
                    {log.weight} kg
                </Text>
                </View>
            ))}
            </ScrollView>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    loader: {
        marginTop: 30,
    },
    card: {
        padding: 15,
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    cardText: {
        fontSize: 16,
        marginBottom: 8,
    },
    weightText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noData: {
        marginTop: 40,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HistoryWeight;
