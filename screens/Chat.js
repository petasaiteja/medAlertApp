import React, {useEffect, useState} from 'react';
import {
    SafeAreaView, View, Modal, Pressable, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar,
    LogBox
} from 'react-native';

import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue} from 'firebase/database';
import firebaseConfig from '../config/fb_cred';

import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Gap from '../components/Gap';
import MedInput from '../components/MedInput';
import MedBtn from '../components/MedBtn';

import joi from '../joi/joi';
import Toast from 'react-native-root-toast';
const {joiEmail} = joi;

export default function Chat({navigation, route, userinfo}) {
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false)
    const [state, setState] = useState({email: ''})
    const toggle = () => setVisible(!visible)

    const onChange = obj => setState({...state, ...obj})

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'Account');

    useEffect(()=>{
        LogBox.ignoreAllLogs();
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data);
                const arr = [];
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                const filterUser = arr.filter(item=>item.email !== userinfo.email)
                setUsers(filterUser)
                const findMe = arr.find(item=>item.email === userinfo.email)
                if(findMe){
                    setChats(findMe?.chats ?? [])
                }
            }
        })
        if(route.params?.user){
            navigation.navigate('ChatMessage', route.params.user)
        }
    }, [route.params?.user])

    const renderItem = ({item}) => {
        return (
            <View style={styles.chatItem}>
                <TouchableOpacity onPress={()=>navigation.navigate('ChatMessage', item)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.icon}>
                            <FontAwesome name="user" size={40} color="#fff" />
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.name}</Text>
                            <Text numberOfLines={1} style={{ fontStyle: 'italic' }}>{item.chats[item.chats.length-1].msg}</Text>
                        </View>
                        <View style={{ padding: 10 }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const adduser = () => {
        const {status, message} = joiEmail(state.email);
        if(status){
            const findU = users.find(item=>item.email === state.email);
            if(findU){
                navigation.navigate('ChatMessage', findU)
            }else{
                toggle()
                Toast.show('ID is not a registered MedAlert user', {duration: Toast.durations.LONG})
            }
        }else{
            Toast.show(message, {duration: Toast.durations.LONG, backgroundColor: 'dodgerblue'})
        }
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.head}>
                <View><Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>MedAlert Chat</Text></View>
                <View style={{ marginRight: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginRight: 20 }}>
                            <Pressable onPress={()=>navigation.navigate('Scan')}>
                                <AntDesign name="scan1" size={24} color="#fff" />
                            </Pressable>
                        </View>
                        <View>
                            <Pressable onPress={toggle}>
                                <Entypo name="add-user" size={24} color="#fff" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <FlatList data={chats} renderItem={renderItem} keyExtractor={item=>item?.msg} />
        </View>
        <StatusBar backgroundColor="dodgerblue" />
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={toggle}
        > 
            <View style={styles.modalview}>
                <View style={{ position: 'absolute', top: 10, right: 10 }}>
                    <Pressable onPress={toggle}>
                        <Entypo name="cross" size={40} color="#fff" />
                    </Pressable>
                </View>

                <View style={{ width: '90%', backgroundColor: '#fff', padding: 10}}>
                    <MedInput 
                        onChange={onChange}
                        value={state.email}
                        name="email" 
                        placeholder="Enter Email Address" 
                    />
                    <Gap height={30} />
                    <MedBtn title="Ask a Doctor" onPress={adduser} />
                </View>
            </View>
        </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    chatItem: { 
        padding: 10, 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc'
    },
    head: { 
        backgroundColor: 'dodgerblue', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        padding: 10 
    },
    icon: {
        width: 60,
        height: 60,
        backgroundColor: 'dodgerblue',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalview: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})