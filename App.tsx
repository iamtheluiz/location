import { useState, useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// React Native UI Kitten
import * as eva from '@eva-design/eva'

import { ApplicationProvider } from '@ui-kitten/components'

import { default as theme } from './src/styles/theme.json'

import { CirclesProvider } from './src/contexts/circles'

import Start from './src/pages/Start'
import Map from './src/pages/Map'
import Points from './src/pages/Points'
import CreatePoint from './src/pages/CreatePoint'
import { Platform } from 'react-native'
import { Container } from './src/styles/Global'

const Stack = createNativeStackNavigator()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

function App() {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setNotification(notification)
      })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response)
      })

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      Notifications.removeNotificationSubscription(notificationListener.current)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <StatusBar style="light" />
      <CirclesProvider>
        <Container>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={Start} />
              <Stack.Screen name="Map" component={Map} />
              <Stack.Screen name="Points" component={Points} />
              <Stack.Screen name="CreatePoint" component={CreatePoint} />
            </Stack.Navigator>
          </NavigationContainer>
        </Container>
      </CirclesProvider>
    </ApplicationProvider>
  )
}

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}

export default App
