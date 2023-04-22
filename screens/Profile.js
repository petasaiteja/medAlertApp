import React from 'react'
import {View, StyleSheet, Text, SafeAreaView, StatusBar} from 'react-native'
import Gap from '../components/Gap'
import Menu from '../components/Menu'
import RemedLogo from '../components/RemedLogo'
import TextValue from '../components/TextValue'
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import Title from '../components/Title'

export default function Profile({navigation, userinfo}) {
    const logout = async() => {
        try{
            await AsyncStorage.removeItem('remeduser')
            .then(()=>{
                Toast.show('Logging out...', {duration: Toast.durations.SHORT})
            })
            .catch(()=>{
                Toast.show('Error occurred while removing data locally', {duration: Toast.durations.SHORT})
            })
            .finally(()=>{
                navigation.navigate('Login')
            });
        }catch(e){
            Toast.show('Logout attempt failed', {duration: Toast.durations.LONG})
        }
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={{ backgroundColor: 'dodgerblue' }}>
                <Gap height={20} />
                <View style={{ alignItems: 'center' }}>
                    <RemedLogo showLogo={true} showName={true} />
                </View>
                <Gap height={20} />
            </View>
            <Gap height={40} />

            <View style={styles.profile}>
                <Title title="User Information" margin={20} size={20} />
                <TextValue label="Name" value={userinfo.fullname} />
                <TextValue label="Age" value={userinfo.age} />
                <TextValue label="Gender" value={userinfo.sex} />
                <TextValue label="Email" value={userinfo.email} />
            </View>
            <View style={{ padding: 10 }}>
                <Menu onPress={logout} icon={<MaterialIcons name="logout" size={24} color="red" />} title="Logout" />
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
    profile: { 
        width: '90%', 
        alignSelf: 'center', 
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3
    }
})