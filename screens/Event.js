import React, {useState, useEffect} from 'react'
import {View, SafeAreaView, StatusBar, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Card from '../components/Card';
import Gap from '../components/Gap';
import RowSpaceBetween from '../components/RowSpaceBetween';
import MedInput from '../components/MedInput';
import RemedLogo from '../components/RemedLogo';
import DumpText from '../components/DumpText';
import { Entypo } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import MedBtn from '../components/MedBtn';
import joi from '../joi/joi';
import Toast from 'react-native-root-toast';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';

const {joiTitleNote} = joi
const defaultState = {title: '', note: ''}

export default function Event({navigation, userinfo}) {
    const [id, setId] = useState(null)
    const [state, setState] = useState(defaultState)
    const [date, setDate] = useState(null);
    const [isdate, setIsDate] = useState(false);
    const [time, setTime] = useState(null);
    const [istime, setIsTime] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dateTimeArr, setDateTimeArr] = useState([])
    const onChange = obj => setState({...state, ...obj})

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
        getEventCalandar()
    }, [])

    const insertArr = val => {
        if(date){
            if(dateTimeArr.length < 4){
                setDateTimeArr([...dateTimeArr, {date, time: val}])
                setTimeout(()=>{
                    setTime(null)
                    setDate(null)
                }, 100)
            }else{
                Toast.show('You are only limited to 4 slot', {duration: Toast.durations.LONG})
            }
        }else if(time){
            if(dateTimeArr.length < 4){
                setDateTimeArr([...dateTimeArr, {date: val, time}])
                setTimeout(()=>{
                    setTime(null)
                    setDate(null)
                }, 100)
            }else{
                Toast.show('You are only limited to 4 slot', {duration: Toast.durations.LONG})
            }
        }
    }

    const handleDate = date => {
        const d = new Date(date).toLocaleDateString().toString()
        const dsplit = d.split('/')
        const mm = Number(dsplit[0]) >= 10 ? dsplit[0] : `0${dsplit[0]}`
        const dd = Number(dsplit[1]) >= 10 ? dsplit[1] : `0${dsplit[1]}`
        const yy = dsplit[2]
        const md = `${yy}-${mm}-${dd}`
        setDate(md)
        toggleDate()
        insertArr(md)
    }
    const toggleDate = () => setIsDate(!isdate);

    const handleTime = time => {
        const t = new Date(time).toLocaleTimeString()
        setTime(t)
        toggleTime()
        insertArr(t)
    }
    const toggleTime = () => setIsTime(!istime);
    const myTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const createEvent = async() => {
        setLoading(true)
        const {status, message} = joiTitleNote(state)
        if(status){
            if(dateTimeArr.length > 0){
                for(let i = 0; i < dateTimeArr.length; i++){
                    const item = dateTimeArr[i]
                    const ampm = item.time.split(' ')[1]
                    const tsplit = item.time.split(':')
                    
                    const hr = ampm === 'AM' ? Number(tsplit[0]) + 4: Number(tsplit[0] +7)
                    const min = Number(tsplit[1])
                    const startD = new Date(`${item.date}T${hr>9?hr:`0${hr}`}:${min > 9 ? min : `0${min}`}:000Z`)
                    await Calendar.createEventAsync(id.toString(), {
                        alarms: [{
                            method: Calendar.AlarmMethod.ALERT,
                            relativeOffset: -1,
                        }],
                        title: state.title,
                        notes: state.note,
                        startDate: startD,
                        endDate: startD,
                        timeZone: 'America/Detroit'
                    })
                    .then((eventId)=>{
                        setLoading(false)
                        // console.log("Event Created", eventId)
                        Toast.show('Event created', {duration: Toast.durations.LONG})
                    })
                    .catch(err=>{
                        setLoading(false)
                        // console.log('creating event error', err)
                        Toast.show('Failed to create event', {duration: Toast.durations.LONG})
                    })
                }
            }else{
                Toast.show('Set date/time for your event.', {duration: Toast.durations.LONG})
            }
            // if(date){
            //     if(time){
            //         const ampm = time.split(' ')[1]
            //         const tsplit = time.split(':')
            //         const hr = Number(tsplit[0]) * 60
            //         const min = Number(tsplit[1])
            //         const totalTime = hr + min + (ampm === 'PM' ? 720 : 0)
            //         let startD = new Date(date)
            //         startD.setHours(startD.getHours() +Number(tsplit[0]))
            //         startD.setMinutes(startD.getMinutes() + Number(tsplit[1]))
            //         await Calendar.createEventAsync(id.toString(), {
            //             alarms: [{
            //                 method: Calendar.AlarmMethod.ALERT,
            //                 relativeOffset: -1,
            //             }],
            //             title: state.title,
            //             notes: state.note,
            //             startDate: startD,
            //             endDate: startD,
            //             timeZone: Localization.timezone
            //         }).then((eventId)=>{
            //             setLoading(false)
            //             console.log("Event Created", eventId)
            //             Toast.show('Event created', {duration: Toast.durations.LONG})
            //         })
            //         .catch(err=>{
            //             setLoading(false)
            //             console.log('creating event error', err)
            //             Toast.show('Failed to create event', {duration: Toast.durations.LONG})
            //         })
            //     }else{
            //         setLoading(false)
            //         Toast.show('You need to set time for your reminder', {duration: Toast.durations.LONG})
            //     }
            // }else{
            //     setLoading(false)
            //     Toast.show('You need to set a date for your reminder', {duration: Toast.durations.LONG})
            // }
        }else{
            setLoading(false)
            Toast.show(message, {duration: Toast.durations.LONG})
        }
    }

    const listTimeDate = dateTimeArr.map((item, index)=>{
        return (
            <View key={index} style={{ marginBottom: 2 }}>
                <RowSpaceBetween>
                    <View style={{ width: '48%' }}><DumpText text={item.date} /></View>
                    <View style={{ width: '48%' }}><DumpText text={item.time} /></View>
                </RowSpaceBetween>
            </View>
        )
    })

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={{ backgroundColor: 'dodgerblue', padding: 10, alignItems: 'center' }}>
                <RemedLogo showLogo={true} viewStyle={{ borderRadius: 50 }} />
            </View>
            <Gap />

            <View style={{ marginBottom: 10 }}>
                <Text style={{ textAlign: 'center', fontSize: 23, fontWeight: 'bold', textTransform: 'uppercase' }}>New Medicine</Text>
            </View>

            <View style={{ width: '90%', alignSelf: 'center' }}>
                <Card>
                    <MedInput placeholder="Medicine Name" name="title" value={state.title} onChange={onChange} />
                    <Gap />
                    <MedInput placeholder="Note" name="note" value={state.note} onChange={onChange} />
                    <Gap />
                    <RowSpaceBetween>
                        <View>
                            <TouchableWithoutFeedback onPress={toggleDate} style={{ padding: 10 }}>
                                <Fontisto name="date" size={24} color="black" />
                            </TouchableWithoutFeedback>
                        </View>
                        <View>
                            <TouchableWithoutFeedback onPress={toggleTime} style={{ padding: 10 }}>
                                <Entypo name="clock" size={24} color="black" />
                            </TouchableWithoutFeedback>
                        </View>
                    </RowSpaceBetween>
                    <Gap />
                    <View>
                        {listTimeDate}
                    </View>
                    {/* <RowSpaceBetween>
                        <View style={{ width: '48%' }}>
                            {date ? <DumpText text={date} /> : <View />}
                        </View>
                        <View style={{ width: '48%' }}>
                            {time ? <DumpText text={time} /> : <View />}
                        </View>
                    </RowSpaceBetween> */}
                    <Gap height={20} />
                    <MedBtn title="Create" loading={loading} onPress={createEvent} />
                </Card>
            </View>

            <DateTimePickerModal
                isVisible={isdate}
                mode="date"
                onConfirm={handleDate}
                onCancel={toggleDate}
            />

            <DateTimePickerModal
                isVisible={istime}
                mode="time"
                onConfirm={handleTime}
                onCancel={toggleTime}
            />
        </View>
        <StatusBar backgroundColor="dodgerblue" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})