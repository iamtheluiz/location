import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CirclesProvider } from './src/contexts/circles'

import Map from './src/pages/Map'
import Points from './src/pages/Points'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <>
      <StatusBar style="auto" />
      <CirclesProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Points" component={Points} />
          </Stack.Navigator>
        </NavigationContainer>
      </CirclesProvider>
    </>
  )
}

export default App
