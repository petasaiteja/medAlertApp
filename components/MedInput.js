import {View, TextInput, Text, StyleSheet} from 'react-native';

export default function MedInput({value, label, placeholder, name, onChange, margin, secure}) {
  return (
    <View style={{ marginBottom: margin ?? 5 }}>
        {label ? <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{label}</Text> : <View />}
        <TextInput 
            value={value ?? ''} 
            style={styles.textinput}
            placeholder={placeholder ?? ''}
            onChangeText={text=>onChange({[name]: text})}
            secureTextEntry={secure ?? false}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  textinput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    padding: 9,
    backgroundColor: '#fff'
  }
})