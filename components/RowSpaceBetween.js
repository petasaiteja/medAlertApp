import {View} from 'react-native';

export default function RowSpaceBetween({children}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>{children}</View>
  );
};
