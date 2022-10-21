import uuid from 'react-native-uuid'
import { createContext, FC, useContext, useEffect, useState } from 'react'
import { LatLng } from 'react-native-maps'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
  circles: NotificationArea[] | null
  setCircles: (circles: NotificationArea[]) => void
  addNewCircle: (circleData: Omit<NotificationArea, 'id'>) => void
  removeCircle: (id: string) => void
  currentLocation: {
    latitude: number
    longitude: number
  }
  isGettingCurrentLocation: boolean
  handleToggleLocation: () => void
}

const CirclesContext = createContext({} as CirclesContextProps)

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION'

async function schedulePushNotification(
  title: string,
  body: string,
  data: any = null
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      // eslint-disable-next-line quotes
      title,
      body,
      data: { data },
      sound: undefined,
      priority: AndroidNotificationPriority.MAX,
    },
    trigger: { seconds: 10 },
  })
}

export const CirclesProvider: FC = ({ children }) => {
  const [circles, setCircles] = useState<NotificationArea[] | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  }>({ latitude: 0, longitude: 0 })
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false)

  async function storeCircles() {
    console.log('storeCircles() =>')
    console.log(' |-> ' + circles!.length)
    await AsyncStorage.setItem('@location/circles', JSON.stringify(circles))
  }

  async function getCirclesFromStorage() {
    try {
      const storedCircles = await AsyncStorage.getItem('@location/circles')
      console.log('getCirclesFromStorage() =>')
      console.log(' |-> ' + storedCircles)

      if (storedCircles) {
        setCircles(JSON.parse(storedCircles))
      }
    } catch (error) {
      setCircles([])
    }
  }

  function removeLocationTracker() {
    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
  }

  useEffect(() => {
    getCirclesFromStorage()

    return removeLocationTracker
  }, [])

  useEffect(() => {
    if (circles) {
      storeCircles()
    }
  }, [circles])

  function addNewCircle(circleData: Omit<NotificationArea, 'id'>) {
    const circle = {
      id: String(uuid.v4()),
      ...circleData,
    }

    setCircles([...circles!, circle])
  }

  function removeCircle(id: string) {
    if (!circles) return

    const filteredCircles = circles?.filter(circle => circle.id !== id)

    setCircles(filteredCircles)
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

      console.log(latitude, longitude)
      setCurrentLocation({ latitude, longitude })
      checkIfLocationIsInsideACircle(latitude, longitude)
    }
  )

  function checkIfLocationIsInsideACircle(
    currentLatitude: number,
    currentLongitude: number
  ) {
    if (!circles) return

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
            const filteredState = oldState!.filter(
              item => item.id !== circle.id
            )
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

  async function handleToggleLocation() {
    const toggledIsGettingCurrentLocation = !isGettingCurrentLocation

    if (toggledIsGettingCurrentLocation) {
      // 2 start the task
      await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1, // minimum change (in meters) betweens updates
        deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
        // foregroundService is how you get the task to be updated as often as would be if the app was open
        foregroundService: {
          notificationTitle: 'Utilizando sua localização',
          notificationBody: 'Para parar, feche o aplicativo!',
        },
      })
    } else {
      await Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
    }

    setIsGettingCurrentLocation(toggledIsGettingCurrentLocation)
  }

  return (
    <CirclesContext.Provider
      value={{
        circles,
        setCircles,
        addNewCircle,
        removeCircle,
        currentLocation,
        isGettingCurrentLocation,
        handleToggleLocation,
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
