import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';

export default function Alarm() {
    const [id, setId] = useState(null)
    const [tz, setTz] = useState(null)

    useEffect(() => {
        (async () => {
          const { status } = await Calendar.requestCalendarPermissionsAsync();
          if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            console.log('Here are all your calendars:');
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
        })();
    }, []);

    const deleteC = async () => {
        console.log('delete clicked')
        await Calendar.deleteCalendarAsync('11').then(()=>{
            console.log('deleted')
        })
        .catch(err=>{
            console.log('c-delete-error', err)
        })
    }

    const createE = async() => {
        await Calendar.createEventAsync(id.toString(), {
            alarms: [{
                method: Calendar.AlarmMethod.ALERT,
                relativeOffset: 1,
                // absoluteDate: "2023-04-09T12:35:00.000Z"
            }],
            title: 'Methan Meetup',
            notes: 'Discuss the app project',
            startDate: new Date(),
            endDate: new Date(),
            timeZone: Localization.timezone
        }).then((eventId)=>{
            console.log("Event Created", eventId)
        })
        .catch(err=>{
            console.log('creating event error', err)
        })
    }
  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      {/* <Button title="Create a new calendar" onPress={createCalendar} /> */}
      <Button title="Create a new calendar" onPress={createE} />
    </View>
  )
}

async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
}

async function createCalendar() {
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
    console.log(`Your new calendar ID is: ${newCalendarID}`);
  }
  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})