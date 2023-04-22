import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MediContext from './config/MediContext';
import Login from './screens/Login';
import Dash from './screens/Dash';
import Event from './screens/Event';
import Events from './screens/Events';
import Chat from './screens/Chat';
import ChatMessage from './screens/ChatMessage'
import Scan from './screens/Scan'
import Pill from './screens/Pill';
import Pills from './screens/Pills';
import Profile from './screens/Profile';
import ForgotPassword from './screens/ForgotPassword';

const Stack = createNativeStackNavigator();

export default function AppRoute() {
  return (
    <MediContext.Consumer>
        {(state)=>(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" options={{ headerShown: false }}>
                        {(props)=><Login {...props} setUserInfo={state.setUserInfo} />}
                    </Stack.Screen>
                    <Stack.Screen name="Dash" options={{ headerShown: false }}>
                        {(props)=><Dash {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen name="Event" options={{ headerShown: false }}>
                        {(props)=><Event {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen name="Events" options={{ headerShown: false }}>
                        {(props)=><Events {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen name="Chat" options={{ headerShown: false }}>
                        {(props)=><Chat {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen name="ChatMessage" options={{ headerShown: false }}>
                        {(props)=><ChatMessage {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen 
                        name="Pill" 
                        options={{
                            headerShown: true,
                            title: 'Add Prescriptions' 
                        }}
                    >
                        {(props)=><Pill {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen 
                        name="Pills" 
                        options={{
                            headerShown: true,
                            title: 'Prescriptions List Manager' 
                        }}
                    >
                        {(props)=><Pills {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen 
                        name="Profile" 
                        options={{
                            headerShown: false,
                            title: 'Remedi Profile' 
                        }}
                    >
                        {(props)=><Profile {...props} userinfo={state.userinfo} />}
                    </Stack.Screen>
                    <Stack.Screen name="Scan" component={Scan} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        )}
    </MediContext.Consumer>
  )
}
