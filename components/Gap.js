import {View} from 'react-native'

export default function Gap({height}) {
  return (
    <View style={{ width: '100%', height: height ?? 10 }} />
  )
}
