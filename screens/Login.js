import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, StyleSheet, StatusBar, Text, Alert, Image} from 'react-native';

import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue, push} from 'firebase/database';
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, sendEmailVerification
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import fb_cred from '../config/fb_cred';
import Title from '../components/Title';
import MedInput from '../components/MedInput';
import MedBtn from '../components/MedBtn';

import joi from '../joi/joi';
import Toast from 'react-native-root-toast';
import RemedLogo from '../components/RemedLogo';
import Gap from '../components/Gap';
const {joiAccount, joiLogin} = joi;

const defaultState = {fullname: '', email: '', password: '', sex: '', age: ''}

export default function Login({navigation, setUserInfo}) {
    const [allAccount, setAllAccount] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [state, setState] = useState(defaultState);
    const onChange = obj => setState({...state, ...obj});

    const app = initializeApp(fb_cred);
    const db = getDatabase(app);
    const dbref = ref(db, 'Account');

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const dataArray = [];
                const data = snapshot.val();
                const keys = Object.keys(data);
                keys.forEach(key => dataArray.push({...data[key], ['id']: key}));
                setAllAccount(dataArray);
            }
        })
    }, [])

    const storeMedData = async(key, data) => {
        try{
            await AsyncStorage.setItem(key, data)
        }catch(e){
            Toast.show('Error occurred while saving data locally', {duration: Toast.durations.LONG})
        }
    }

    const emailLink = auth => {
        sendEmailVerification(auth.currentUser)
        .then(()=>{
            setLoading(false);
            Toast.show('Email sent.', {duration: Toast.durations.LONG})
        })
        .catch(()=>{
            setLoading(false)
            const msg = 'Failed to send email verification. Try again.'
            Toast.show(msg, {duration: Toast.durations.LONG})
        })
    }

    const onSubmit = async() => {
        setLoading(true);
        const auth = getAuth()
        if(toggle){
            const {status, message} = joiAccount(state)
            if(status){
                createUserWithEmailAndPassword(auth, state.email, state.password)
                .then(userCredential=>{
                    const obj = {fullname: state.fullname, email: state.email, age: state.age, sex: state.sex}
                    push(dbref, obj)
                    .then(()=>{
                        sendEmailVerification(auth.currentUser)
                        .then(()=>{
                            setLoading(false);
                            setToggle(!toggle)
                            Toast.show('Account created. Check your email for verification link', {duration: Toast.durations.LONG})
                        })
                        .catch(()=>{
                            setLoading(false);
                            Toast.show('Account created but failed to send email verification', {duration: Toast.durations.LONG})
                        })
                    })
                    .catch(()=>{
                        setLoading(false)
                        Toast.show('Error occurred while saving data', {duration: Toast.durations.LONG})
                    })
                })
                .catch(err=>{
                    const msg = err.message.split('/')[1].split(')')[0]
                    setLoading(false);
                    Toast.show(msg, {duration: Toast.durations.LONG})
                })
            }else{
                setLoading(false);
                Toast.show(message, {duration: Toast.durations.LONG})
            }
        }else{
            const {status, message} = joiLogin(state)
            if(status){
                signInWithEmailAndPassword(auth, state.email, state.password)
                .then(userCredential=>{
                    if(userCredential.user.emailVerified){
                        const findAcc = allAccount.find(item=>item.email === state.email)
                        storeMedData('remeduser', JSON.stringify(findAcc))
                        setUserInfo(findAcc)
                        setLoading(false)
                        setState(defaultState)
                        navigation.navigate('Dash')
                    }else{
                        setLoading(false)
                        Alert.alert('Error', 'Account not verified. Do you want to send a new email verification?', [
                            {text: 'OK', onPress: ()=>emailLink(auth)},
                            {text: 'No'}
                        ])
                    }
                })
                .catch(err=>{
                    const msg = err.message.split('/')[1].split(')')[0]
                    setLoading(false)
                    Toast.show(msg, {duration: Toast.durations.LONG})
                })
            }else{
                setLoading(false);
                Toast.show(message, {duration: Toast.durations.LONG});
            }
        }
    }

  return (
    <SafeAreaView style={{ flex:1 }}>
        <View style={styles.container}>
            <RemedLogo showLogo={true} showName={true} />
            <View style={styles.mediform}>
                <Title title={toggle ? 'Create Account' :'Account Login'} size={20} margin={15} />
                {toggle ? <MedInput value={state.fullname} name="fullname" onChange={onChange} label="Enter Fullname" /> : <React.Fragment />}
                {toggle ? <MedInput value={state.age} name="age" onChange={onChange} label="Enter Age" /> : <React.Fragment />}
                {toggle ? <MedInput value={state.sex} name="sex" onChange={onChange} label="Enter Sex. eg. F or M" /> : <React.Fragment />}
                <MedInput name="email" value={state.email} onChange={onChange} label="Enter Email Address" margin={20} />
                <MedInput name="password" value={state.password} onChange={onChange} label="Enter Password" margin={toggle ? 20 : 10} secure />
                {!toggle ? <Text style={{ color: 'orange', fontWeight: 'bold' }} onPress={()=>navigation.navigate('ForgotPassword')}>Forgot Password?</Text> : <View />}
                {!toggle ? <Gap height={20} /> : <View />}
                <MedBtn onPress={onSubmit} loading={loading} title={toggle ? 'Register' : 'Login'} margin={25} />

                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                    {toggle ? 'Already have an account?': "Don't have an account?"} <Text onPress={()=>setToggle(!toggle)} style={{ fontWeight: 'bold', color: '#61AEE8' }}>{toggle ? 'Sign In': 'Sign Up'}</Text>
                </Text>
            </View>
        </View>
        <StatusBar backgroundColor="#000" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#61AEE8'
    },
    mediform: {
        width: '90%',
        padding: 10,
        borderRadius: 3,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        alignSelf: 'center'
    },
})