import {View, Image, Text, StyleSheet, Pressable} from 'react-native'
import logo from '../assets/bill.jpg'

export default function RemedLogo({showLogo, showName, viewStyle, textStyle, onLongPress}) {
  return (
    <>
        {
            showLogo
            ?
            <Pressable onLongPress={()=>onLongPress ? onLongPress() : null}>
                <View style={[styles.logo, viewStyle ?? {width: 100}]}>
                    <Image source={logo} style={styles.img} />
                </View>
            </Pressable>
            :
            <View/>
        }
        {
            showName
            ?
            <View>
                <Text style={[styles.appname, textStyle ?? {fontWeight: 'bold'}]}>MedAlert</Text>
            </View>
            :
            <View />
        }
    </>
  )
}

const styles = StyleSheet.create({
    appname: {
        fontWeight: 'bold',
        // textTransform: 'uppercase',
        fontSize: 20,
        color: '#fff',
        marginBottom: 5
    },
    img: {
        width: 100,
        height: 100
    },
    logo:{
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
        elevation: 20,
        shadowOffset: {
            width: -2, 
            height: 4
        },  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 3,
        overflow: 'hidden',
    },
})