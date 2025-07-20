import * as React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { fetchUserDataConnected } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider'
import { getAuth } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { firestore } from '@/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/interface/User';
import Generate from '@/components/CreateAliment/Generate';
import { Switch } from 'react-native-paper';
import Create from '@/components/CreateAliment/Create'



function CreateAliment() {

    const {colors} = useTheme();

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
            <Text style={{fontSize: 24, fontWeight: 500, margin: 'auto', marginBottom: 10}}>Switch Mode</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                <Text style={{width: 100, textAlign: 'center',fontWeight: 500, fontSize: 19, color: isSwitchOn ? colors.grayDarkFix : colors.black}}>Generate</Text>
                <Switch color='black' value={isSwitchOn} onValueChange={onToggleSwitch} />
                <Text style={{width: 100,fontSize: 20, fontWeight: 500, textAlign: 'center', color: isSwitchOn ? colors.black : colors.grayDarkFix}}>Create</Text>
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
    }
});

export default CreateAliment