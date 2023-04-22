import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export default function Menu({icon, title, onPress}) {
  return (
    <View style={{ marginBottom: 5 }}>
        <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View>{icon ?? <View />}</View>
                <View style={{ marginLeft: 10 }}><Text style={{ fontSize: 20 }}>{title ?? ''}</Text></View>
            </View>
        </TouchableOpacity>
    </View>
  );
};
