import {View, Text} from 'react-native';

export default function DumpText({text}) {
  return (
    <View style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 3 }}>
        <Text>{text ?? ''}</Text>
    </View>
  );
};
