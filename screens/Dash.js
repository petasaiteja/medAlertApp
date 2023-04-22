import {View, StyleSheet, SafeAreaView, Text, StatusBar, TouchableWithoutFeedback} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import RemedLogo from '../components/RemedLogo';
import Gap from '../components/Gap';

import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Menu from '../components/Menu';

import {useEffect, useState} from 'react';
import * as Calendar from 'expo-calendar';

import QRCode from 'react-native-qrcode-svg';

export default function Dash({navigation, userinfo}) {
    const [id, setId] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const toggleShowQR = () => setShowQR(!showQR);

    const getEventCalandar = async() => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            // console.log('Here are all your calendars:');
            const findC = calendars.find(item=>item.title === 'Expo Calendar');
            if(!findC){
                const defaultCalendarSource =
                Platform.OS === 'ios'
                    ? await getDefaultCalendarSource()
                    : { isLocalAccount: true, name: 'Expo Calendar' };
                const newCalendarID = await Calendar.createCalendarAsync({
                    title: 'Expo Calendar',
                    color: 'blue',
                    entityType: Calendar.EntityTypes.EVENT,
                    sourceId: defaultCalendarSource.id,
                    source: defaultCalendarSource,
                    name: 'internalCalendarName',
                    ownerAccount: 'personal',
                    accessLevel: Calendar.CalendarAccessLevel.OWNER,
                });
                setId(newCalendarID);
            }else{
                setId(findC.id)
            }
        }
    }

    useEffect(()=>{
        getEventCalandar();
    }, [])

    const event = () => navigation.navigate('Event');
    const events = () => navigation.navigate('Events', {id: id});
    const chat = () => navigation.navigate('Chat');
    const pill = () => navigation.navigate('Pill')
    const pills = () => navigation.navigate('Pills')
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={{ backgroundColor: 'dodgerblue', padding: 10 }}>
                <RemedLogo showLogo={true} viewStyle={{ alignSelf: 'center', borderRadius: 50 }} />
            </View>
            <View style={styles.profileInfo}>
                <View style={styles.profile}>
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate('Profile')}>
                        <FontAwesome name="user" size={40} color="dodgerblue" />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.profileText}>
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', color:'#fff', fontSize: 18 }}>{userinfo?.fullname ?? ''}</Text>
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', color:'#fff', }}>{userinfo?.email ?? ''}</Text>
                </View>
            </View>
            <Gap height={20} />
            <View style={styles.dash}>
                <Menu onPress={event} icon={<AntDesign name="calendar" size={24} color="dodgerblue" />} title="Add Reminder" />
                <Menu onPress={events} icon={<MaterialIcons name="event" size={24} color="black" />} title="Reminders" />
                <Menu onPress={pill} icon={<Fontisto name="pills" size={24} color="red" />} title="Add Prescription" />
                <Menu onPress={pills} icon={<Fontisto name="first-aid-alt" size={24} color="green" />} title="Prescription" />
                <Menu onPress={chat} icon={<Entypo name="chat" size={24} color="dodgerblue" />} title="Chat A Doctor" />
            </View>

            {
                showQR
                ?
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <QRCode
                        value={JSON.stringify(userinfo)}
                    />
                </View>
                :
                <View />
            }
        </View>
        <StatusBar backgroundColor="dodgerblue" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dash: {
        width: '90%',
        alignSelf: 'center',
    },
    profile:{
        width: 70,
        height: 70,
        // backgroundColor: '#61AEE8',
        backgroundColor: '#fff',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        // backgroundColor: '#fff'
        backgroundColor: 'dodgerblue'
    },
    profileText: {
        padding: 10
    }
})