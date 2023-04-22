import {useState, useEffect} from 'react'
import {SafeAreaView, View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Alert} from 'react-native'

import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, set } from 'firebase/database'
import firebaseConfig from '../config/fb_cred'
import Toast from 'react-native-root-toast'

export default function Pills({navigation, userinfo}) {
    const [userAcc, setUserAcc] = useState(null)
    const [pills, setPills] = useState([])

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'Account')

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key => arr.push({...data[key], ['id']: key}))
                let findA = arr.find(item=>item.email === userinfo.email)
                if(findA){
                    findA['prescription'] = findA['prescription'] ?? []
                    setUserAcc(findA)
                    setPills(findA['prescription'])
                }
            }
        })
    }, [])

    const subPill = obj => {
        userAcc.prescription.map(pres=>{
            if(pres.name === obj.name){
                pres['total'] = pres['total'] > obj.dose ? pres['total'] - obj.dose : 0
            }
            return pres
        })
        set(ref(db, `Account/${userAcc.id}`), userAcc)
        .then(()=>{
            Toast.show('Dosage deducted successfully', {duration: Toast.durations.LONG})
        })
        .catch(()=>{
            Toast.show('Error occurred while deducting dosage', {duration: Toast.durations.LONG})
        })
    }

    const deductPill = obj => {
        const title = 'Pill Manager'
        const msg = `Do you want to reduce the total quantity of ${obj.name} by ${obj.dose}?`
        Alert.alert(title, msg, [
            {text: 'NO'},
            {text: 'YES', onPress: ()=>subPill(obj)}
        ])
    }

    const renderItem = ({item}) => {
        return (
            <View>
                <TouchableWithoutFeedback onLongPress={()=>deductPill(item)}>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>{item.name}</Text>
                        <Text style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'rgb(100, 100, 100)' }}>Quantity left: <Text style={{ fontStyle: 'normal' }}>{item.total}</Text></Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <FlatList data={pills} renderItem={renderItem} keyExtractor={item=>item?.name} />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    pillText: {
        fontWeight: 'bold',
        fontSize: 18
    },
    pill: {
        backgroundColor: '#fff',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10
    }
})