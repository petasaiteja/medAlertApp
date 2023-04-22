import {View, Text, StyleSheet} from 'react-native';

export default function Title({title, size, textAlign, color, margin}) {
  return (
    <View style={{ marginBottom: margin ?? 5 }}>
        <Text 
            style={[
                styles.title, 
                {
                    fontSize: size ?? styles.title.fontSize,
                    textAlign: textAlign ?? styles.title.textAlign,
                    color: color ?? 'black'
                }
            ]}
        >
            {title ?? ''}
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'left'
    }
})