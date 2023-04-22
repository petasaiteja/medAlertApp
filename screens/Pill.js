import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native'
import Toast from 'react-native-root-toast'
import Gap from '../components/Gap'
import MedBtn from '../components/MedBtn'
import MedInput from '../components/MedInput'

import {initializeApp} from 'firebase/app'
import {getDatabase, ref, set, onValue} from 'firebase/database'
import firebaseConfig from '../config/fb_cred'

import joi from '../joi/joi'
const {joiPrescription} = joi

export default function Pill({navigation, userinfo}) {
    const [state, setState] = useState({name: '', total: '', dose: ''})
    const onChange = obj => setState({...state, ...obj})
    const [loading, setLoading] = useState(false)
    
    const [acc, setAcc] = useState(null)
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'Account')

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                
                let findAcc = arr.find(item=>item.email === userinfo.email)
                findAcc['prescription'] = findAcc['prescription'] ?? []
                setAcc(findAcc)
            }
        })
    }, [])

    const updateP = acc => {
        set(ref(db, `Account/${acc.id}`), acc)
        .then(()=>{
            Toast.show('Prescription successfully updated', {duration: Toast.durations.LONG})
        })
        .catch(err=>{
            Toast.show('Error occurred while updating prescription', {duration: Toast.durations.LONG})
        })
        .finally(()=>setLoading(false))
    }

    const submit = () => {
        setLoading(true)
        const {status, message} = joiPrescription(state)
        if(status){
            if(acc.prescription.length === 0){
                acc.prescription.push({name: state.name.trim(), total: Number(state.total), dose: Number(state.dose)})
                set(ref(db, `Account/${acc.id}`), acc)
                .then(()=>{
                    Toast.show('Prescription successfully added', {duration: Toast.durations.LONG})
                })
                .catch(err=>{
                    Toast.show('Error occurred while adding prescription', {duration: Toast.durations.LONG})
                })
                .finally(()=>setLoading(false))
            }else{
                const findA = acc.prescription.find(pres=>pres.name === state.name)
                if(findA){
                    if(findA.total === 0){
                        acc.prescription.map(item=>{
                            if(item.name === state.name){
                                item['total'] = Number(state.total)
                                item['dose'] = Number(state.dose)
                            }
                            return item
                        })
                        set(ref(db, `Account/${acc.id}`), acc)
                        .then(()=>{
                            Toast.show('Prescription successfully updated', {duration: Toast.durations.LONG})
                        })
                        .catch(err=>{
                            Toast.show('Error occurred while updating prescription', {duration: Toast.durations.LONG})
                        })
                        .finally(()=>setLoading(false))
                    }else{
                        acc.prescription.map(item=>{
                            if(item.name === state.name){
                                item['total'] = Number(state.total)
                                item['dose'] = Number(state.dose)
                            }
                            return item
                        })
                        Alert.alert('Existing Prescription', 'Do you want to update this existing prescription', [
                            {text: 'NO', onPress: ()=>setLoading(false)},
                            {text: 'YES', onPress: ()=>updateP(acc)}
                        ])
                    }
                }else{
                    acc.prescription.push({name: state.name.trim(), total: Number(state.total), dose: Number(state.dose)})
                    set(ref(db, `Account/${acc.id}`), acc)
                    .then(()=>{
                        Toast.show('Prescription successfully added', {duration: Toast.durations.LONG})
                    })
                    .catch(err=>{
                        Toast.show('Error occurred while adding prescription', {duration: Toast.durations.LONG})
                    })
                    .finally(()=>setLoading(false))
                }
            }
        }else{
            setLoading(false)
            Toast.show(message, {duration: Toast.durations.LONG})
        }
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Gap height={30} />
            <View style={styles.form}>
                <MedInput 
                    value={state.name} 
                    name="name" 
                    onChange={onChange} 
                    placeholder="Medicine Name" 
                    margin={20} 
                />
                <MedInput 
                    value={state.total}
                    name="total"
                    onChange={onChange}
                    placeholder="Medicine Count" 
                    margin={20} 
                />
                <MedInput 
                    name="dose"
                    onChange={onChange}
                    value={state.dose}
                    placeholder="Daily Dose" 
                    margin={40} 
                />
                <MedBtn onPress={submit} loading={loading} title="Add Prescription" />
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    form: {
        width: '90%',
        alignSelf: 'center'
    }
})