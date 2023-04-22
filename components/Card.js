import {View, StyleSheet} from 'react-native'

export default function Card({children}) {
  return (
    <View style={styles.card}>{children}</View>
  )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        elevation: 20,
        shadowOffset: {
            width: -2, 
            height: 4
        },  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 3,
    }
})