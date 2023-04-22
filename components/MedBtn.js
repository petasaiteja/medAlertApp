import {View, TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native'

export default function MedBtn({margin, title, loading, onPress, bgColor}) {
    if(!loading){
        return (
            <View style={{ marginBottom: margin ?? 5 }}>
                <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
                    <View style={[styles.button, {backgroundColor: bgColor ?? styles.button.backgroundColor}]}>
                        <Text style={[styles.buttonText]}>{title ?? 'Button'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
  return (
    <View style={{ marginBottom: margin ?? 5 }}>
        <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
            <View style={[styles.button, {backgroundColor: bgColor ?? styles.button.backgroundColor}]}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'dodgerblue',
        padding: 10,
        borderRadius: 3,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff'
    }
})