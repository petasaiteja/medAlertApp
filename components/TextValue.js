import {View, Text} from 'react-native'

export default function TextValue({label, value}) {
  return (
    <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>{label ?? ''}</Text>
        <Text>{value ?? ''}</Text>
    </View>
  )
}
