import React, {useState, useEffect} from 'react';
import * as Calendar from 'expo-calendar';
import {View, SafeAreaView, StyleSheet, StatusBar, Text, FlatList, TouchableOpacity, LogBox} from 'react-native';
import Gap from '../components/Gap';
import Toast from 'react-native-root-toast';

export default function Events({navigation, route}) {
    const [events, setEvents] = useState([]);
    const [id, setId] = useState(null);

    const getEvents = async(id) => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        const yy = new Date().getFullYear();
        if (status === 'granted') {
            const event = await Calendar.getEventsAsync([id], new Date(`${yy}-01-01`), new Date(`${yy}-12-31`));
            setEvents(event ?? []);
        }
    }
    useEffect(()=>{
        LogBox.ignoreAllLogs()
        const id = route.params.id ?? null;
        setId(id);
        getEvents(id);
    }, [])

    const deleteEvent = async(eventId) => {
        await Calendar.deleteEventAsync(eventId)
        .then(()=>{
            getEvents(id)
            Toast.show('Event deleted', {duration: Toast.durations.LONG});
        })
        .catch((err)=>{
            console.log(err)
            Toast.show('Error occurred while deleting event', {duration: Toast.durations.LONG});
        });
    }

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity onLongPress={()=>deleteEvent(item?.id)} style={{ marginBottom: 8 }}>
                <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 3, borderWidth:1, borderColor: '#ccc'}}>
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 3 }}>{item?.title ?? ''}</Text>
                    <Text numberOfLines={1} style={{ color: 'rgb(40,40,40)' }}>{item?.notes ?? ''}</Text>
                    <Text numberOfLines={1} style={{ fontStyle: 'italic', color: 'rgb(100,100,100)', fontWeight: 'bold' }}>{item?.startDate ? new Date(item.startDate).toDateString() : ''}</Text>
                </View>
            </TouchableOpacity>
        );
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={{ backgroundColor:'dodgerblue', padding: 10 }}>
                <Text style={[styles.title, {color: '#fff'}]}>All Reminder Events</Text>
            </View>
            <Gap height={20} />
            <View style={{ width: '95%', alignSelf: 'center' }}>
                {
                    events.length === 0
                    ?
                    <View><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>No Reminder Events</Text></View>
                    :
                    <FlatList data={events} renderItem={renderItem} keyExtractor={item=>item?.id} />
                }
            </View>
        </View>
        <StatusBar backgroundColor="dodgerblue" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        padding: 5
    }
})