import React, {useEffect, useState} from 'react'
import {
    SafeAreaView, ScrollView, Text, View, StatusBar, StyleSheet, TouchableWithoutFeedback, LogBox
} from 'react-native'

import { FontAwesome } from '@expo/vector-icons';

import {initializeApp} from 'firebase/app';
import {getDatabase, set, ref, onValue} from 'firebase/database'
import firebaseConfig from '../config/fb_cred';
import MedInput from '../components/MedInput';
import { Ionicons } from '@expo/vector-icons';

export default function ChatMessage({navigation, route, userinfo}) {
    const [chat, setChat] = useState([])
    const [state, setState] = useState({msg: ''})
    const [receiver, setReceiver] = useState(null)
    const [sender, setSender] = useState(null)
    const onChange = obj => setState({...state, ...obj})

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'Account')

    useEffect(()=>{
        LogBox.ignoreAllLogs();
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                let findSender = arr.find(item=>item.email === userinfo.email)
                findSender['chats'] = findSender['chats'] ? findSender['chats'] : []
                let findReceiver = arr.find(item=>item.email === route.params?.email)
                findReceiver['chats'] = findReceiver['chats'] ? findReceiver['chats'] : []
                const findMyChat = findSender['chats'].find(item=>item.email === route.params?.email)
                setSender(findSender)
                setReceiver(findReceiver)
                setChat(findMyChat?.chats ?? [])
            }
        })
    }, [])

    const messageList = chat.length === 0 ? <View /> : chat.map((item, index)=>{
        return (
            <View key={index} style={item.email === userinfo.email ? styles.senderHolder : styles.receiverHolder}>
                <View style={item.email === userinfo.email ? styles.sender : styles.receiver}>
                    <Text style={item.email === userinfo.email ? styles.senderText : styles.receiverText}>{item.msg}</Text>
                </View>
            </View>
        )
    })

    const sendMessage = () => {
        if(state.msg){
            const sMsg = {email: sender.email, msg: state.msg}
            const rMsg = {email: sender.email, msg: state.msg}

            if(sender.chats.length > 0){
                const findC = sender.chats.find(item=>item.email === receiver.email)
                findC['chats'] = [...findC['chats'], sMsg]
                const filterItem = sender.chats.filter(item=>item.email !== receiver.email)
                const finalArr = [findC, ...filterItem]

                sender['chats'] = finalArr
            }else{
                sender['chats'] = [ {email: receiver.email, name: receiver.fullname, chats: [sMsg]} ]
            }

            if(receiver.chats.length > 0){
                const findC = receiver.chats.find(item=>item.email === sender.email)
                findC['chats'] = [...findC['chats'], sMsg]
                const filterItem = receiver.chats.filter(item=>item.email !== sender.email)
                const finalArr = [findC, ...filterItem]

                receiver['chats'] = finalArr
            }else{
                receiver['chats'] = [ {email: sender.email, name: sender.fullname, chats: [rMsg]} ]
            }

            const sendref = ref(db, `Account/${sender.id}`)
            const receiveref = ref(db, `Account/${receiver.id}`)

            set(sendref, sender)
            set(receiveref, receiver)
            setState({...state, msg: ''})
        }
    }

    // console.log(sender)
    // console.log(receiver)
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.head}>
                <View style={styles.headimg}>
                    <FontAwesome name="user" size={25} color="#fff" />
                </View>
                <View style={{ paddingLeft: 10 }}>
                    <Text numberOfLines={1} style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>{receiver?.fullname ?? ''}</Text>
                </View>
            </View>
            <View style={styles.body}>
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    {messageList}
                </ScrollView>
            </View>
            <View style={styles.input}>
                <View style={styles.left}>
                    <View style={{ marginTop: 5 }}>
                        <MedInput name="msg" value={state.msg} onChange={onChange} placeholder="Type message..." />
                    </View>
                </View>
                <View style={styles.right}>
                    <TouchableWithoutFeedback onPress={sendMessage} style={{ padding: 10 }}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
        <StatusBar backgroundColor="dodgerblue" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    body: {
        // backgroundColor: 'red',
        flex: 12
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    head: {
        backgroundColor: 'dodgerblue',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    headimg: {
        width: 45,
        height: 45,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 50
    },
    input: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: 'dodgerblue'
    },
    left: {
        width: '90%',
    },
    right: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    receiver: {
        maxWidth: '50%',
        padding: 3,
        marginBottom: 3,
        marginTop: 2,
        marginRight: 3
    },
    receiverText: {
        backgroundColor: 'rgba(100, 100, 100, 0.8)',
        color: 'white',
        padding: 10,
        borderRadius: 10
    },
    receiverHolder: {
        flexDirection: 'row'
    },
    sender: {
        maxWidth: '50%',
        padding: 3,
        marginBottom: 3,
        marginTop: 2,
        marginRight: 3
    },
    senderHolder: {
        flexDirection: 'row-reverse'
    },
    senderText: {
        backgroundColor: 'dodgerblue',
        color: 'white',
        padding: 10,
        borderRadius: 10
    },
})