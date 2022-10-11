import uuid from 'react-native-uuid'
import { createContext, FC, useContext, useState } from 'react'
import { LatLng } from 'react-native-maps'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { AndroidNotificationPriority } from 'expo-notifications'
import { getDistanceFromLatLonInKm } from '../utils/getDistanceFromLatLonInKm'

export type NotificationArea = {
  id: string
  name: string
  radius: number
  latlng: LatLng
  lastNotified: null | Date
}

interface CirclesContextProps {
  circles: NotificationArea[]
  setCircles: (circles: NotificationArea[]) => void
  addNewCircle: (circleData: Omit<NotificationArea, 'id'>) => void
  currentLocation: {
    latitude: number
    longitude: number
  }
}

const CirclesContext = createContext({} as CirclesContextProps)

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION'

async function schedulePushNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      // eslint-disable-next-line quotes
      title,
      body,
      data: { data: 'goes here' },
      sound: undefined,
      priority: AndroidNotificationPriority.MAX,
    },
    trigger: { seconds: 10 },
  })
}

export const CirclesProvider: FC = ({ children }) => {
  const [circles, setCircles] = useState<NotificationArea[]>([])
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  }>({ latitude: 0, longitude: 0 })

  function addNewCircle(circleData: Omit<NotificationArea, 'id'>) {
    const circle = {
      id: String(uuid.v4()),
      ...circleData,
    }

    setCircles([...circles, circle])
  }

  TaskManager.defineTask(
    TASK_FETCH_LOCATION,
    ({ data: { locations }, error }: any) => {
      if (error) {
        console.error(error)
        return
      }
      const [location] = locations
      const {
        coords: { latitude, longitude },
      } = location

      setCurrentLocation({ latitude, longitude })
      checkIfLocationIsInsideACircle(latitude, longitude)
    }
  )

  // 2 start the task
  Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1, // minimum change (in meters) betweens updates
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
    // foregroundService is how you get the task to be updated as often as would be if the app was open
    foregroundService: {
      notificationTitle: 'Utilizando sua localização',
      notificationBody: 'Para parar, feche o aplicativo!',
    },
  })

  function checkIfLocationIsInsideACircle(
    currentLatitude: number,
    currentLongitude: number
  ) {
    circles.map(circle => {
      const { radius } = circle
      const { latitude, longitude } = circle.latlng

      const distance =
        getDistanceFromLatLonInKm(
          latitude,
          longitude,
          currentLatitude,
          currentLongitude
        ) * 1000

      console.log('=============')
      console.log(circle.name)
      console.log(distance)
      console.log(radius)
      if (circle.lastNotified) {
        console.log(
          new Date().getTime() / 1000 - circle.lastNotified.getTime() / 1000
        )
      }

      if (Math.abs(distance) <= radius) {
        // Dentro da área
        if (
          !circle.lastNotified ||
          new Date().getTime() / 1000 - circle.lastNotified.getTime() / 1000 >
            60
        ) {
          schedulePushNotification(
            `Você está em ${circle.name}`,
            `\n\nVocê acabou de chegar em ${
              circle.name
            }.\n\nFaltam ${20} kms para seu destino!`
          )
          setCircles(oldState => {
            const filteredState = oldState.filter(item => item.id !== circle.id)
            const newCircle = {
              ...circle,
              lastNotified: new Date(),
            }
            return [...filteredState, newCircle]
          })
        }
      }
    })
  }

  return (
    <CirclesContext.Provider
      value={{
        circles,
        setCircles,
        addNewCircle,
        currentLocation,
      }}
    >
      {children}
    </CirclesContext.Provider>
  )
}

export function useCircles() {
  const context = useContext(CirclesContext)

  if (!context) {
    throw new Error('useCircles must be used within a CirclesProvider')
  }

  return context
}
