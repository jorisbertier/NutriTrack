import * as React from 'react';
import { fetchUserDataConnected } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider'
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { User } from '@/interface/User';
import Generate from '@/components/CreateAliment/Generate';
import { Switch } from 'react-native-paper';
import Create from '@/components/CreateAliment/Create'
import { useTranslation } from 'react-i18next';

function CreateAliment() {

    const {colors} = useTheme();
    const { t } = useTranslation();

    /*Get id user*/
    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    useEffect(() => {
        try {
            const fetch = async () => {
                fetchUserDataConnected(user, setUserData)
            }
            fetch()
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, [user]);

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.whiteMode}]} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={[styles.title, { color: colors.black}]}>{t('switch')}</Text>
            <View style={styles.containerSwitch}>
                <View style={[styles.wrapper, { backgroundColor: isSwitchOn ? colors.gray : colors.blueLight}]}>
                    <Text style={[styles.textSwitch, { color: isSwitchOn ? colors.grayDarkFix : colors.black}]}>{t('generate')}</Text>
                </View>
                <Switch color='black' value={isSwitchOn} onValueChange={onToggleSwitch} />
                <View style={[styles.wrapper, { backgroundColor: isSwitchOn ? colors.blueLight : colors.gray}]}>
                    <Text style={[styles.textSwitch, { color: isSwitchOn ? colors.black : colors.grayDarkFix}]}>{t('create')}</Text>

                </View>
            </View>
            
            {!isSwitchOn && (
                <Generate/>
            )}
            {isSwitchOn && (
                <Create/>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title : {
        fontSize: 24,
        fontWeight: 500,
        margin: 'auto',
        marginBottom: 10
    },
    containerSwitch : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 10
    },
    textSwitch: {
        width: 100,
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 16
    },
    text : {
        width: 100,
        fontSize: 20,
        fontWeight: 500,
        textAlign: 'center'
    },
    wrapper : {
        height: 60,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
});

export default CreateAliment