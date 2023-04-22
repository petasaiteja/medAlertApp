import MediProvider from './config/MediProvider';
import AppRoute from './AppRoute';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  return (
    <MediProvider>
      <RootSiblingParent>
        <AppRoute />
      </RootSiblingParent>
    </MediProvider>
  )
}
