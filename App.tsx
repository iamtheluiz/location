import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import MapView, { Circle, LatLng } from 'react-native-maps'
import * as Location from 'expo-location'
import uuid from 'react-native-uuid'

import styled from 'styled-components/native'
import { Text } from 'react-native'

type NotificationArea = {
  id: string
  name: string
  radius: number
  latlng: LatLng
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`

export default function App() {
  const [granted, setGranted] = useState(false)
  const [location, setLocation] = useState<Location.LocationObject>()
  const [circles, setCircles] = useState<NotificationArea[]>([])

  useEffect(() => {
    // Request location permission
    async function getLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        return
      }

      setGranted(true)
      const location = await Location.getCurrentPositionAsync()
      setLocation(location)
    }

    getLocationPermission()
  }, [])

  function handleCreateCircleInLocation(location: LatLng) {
    console.log(location)
    const circle = {
      id: String(uuid.v4()),
      name: 'Any name',
      latlng: location,
      radius: 320,
    }

    console.log(circle)
    setCircles([...circles, circle])
    console.log(circles)
  }

  function handleRemoveCircle(circle: NotificationArea) {
    setCircles(circles.filter(item => item.id === circle.id))
  }

  function checkIfLocationIsInsideCircle() {
    console.log('Checking')
  }

  return (
    <Container>
      <StatusBar style="auto" />
      {granted === false || !location ? (
        <Text>Location permission needed!</Text>
      ) : (
        <MapView
          initialRegion={{
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          onPress={event =>
            handleCreateCircleInLocation(event.nativeEvent.coordinate)
          }
          showsUserLocation
          followsUserLocation
          onUserLocationChange={checkIfLocationIsInsideCircle}
        >
          {circles.map(circle => (
            <Circle
              key={circle.id}
              center={circle.latlng}
              radius={circle.radius}
              strokeWidth={1}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(230,238,255,0.5)'}
              onPress={() => handleRemoveCircle(circle)}
            />
          ))}
        </MapView>
      )}
    </Container>
  )
}
