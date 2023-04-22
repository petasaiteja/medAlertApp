import {useState} from 'react'
import {View, StyleSheet, Text, SafeAreaView} from 'react-native'
import MedBtn from '../components/MedBtn'
import MedInput from '../components/MedInput'
import RemedLogo from '../components/RemedLogo'
import Title from '../components/Title'
import Toast from 'react-native-root-toast'

import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import joi from '../joi/joi'

const {joiEmail} = joi
const defaultState = {email: '', confirmEmail: ''}

export default function ForgotPassword({navigation}) {
    const [state, setState] = useState(defaultState)
    const [loading, setLoading] = useState(false)
    const onChange = obj => setState({...state, ...obj})

    const resetP = () => {
        setLoading(true)
        const {email, confirmEmail} = state
        if(email && confirmEmail){
            if(email === confirmEmail){
                const {status, message} = joiEmail(email)
                if(status){
                    const auth = getAuth()
                    sendPasswordResetEmail(auth, email)
                    .then(()=>{
                        setLoading(false)
                        setState(defaultState)
                        Toast.show('Check your email for password reset link', {duration: Toast.durations.LONG})
                        navigation.goBack()
                    })
                    .catch(()=>{
                        setLoading(false)
                        Toast.show('Failed to send password reset link', {duration: Toast.durations.LONG})
                    })
                }else{
                    setLoading(false)
                    Toast.show(message, {duration: Toast.durations.LONG})
                }
            }else{
                setLoading(false)
                Toast.show('Email address does not match', {duration: Toast.durations.LONG})
            }
        }else{
            setLoading(false)
            Toast.show('All the fields are required', {duration: Toast.durations.LONG})
        }
    }
    
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <RemedLogo showLogo={true} showName={true} />
            <View style={styles.mediform}>
                <Title title="Password Reset" size={20} margin={15} />
                <MedInput onChange={onChange} name="email" value={state.email} label="Enter Email Address" margin={20} />
                <MedInput onChange={onChange} name="confirmEmail" value={state.confirmEmail} label="Confirm Email Address" margin={40} />
                <MedBtn title="Send Password Reset Link" loading={loading} onPress={resetP} />
            </View>
        </View>
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
    }
})