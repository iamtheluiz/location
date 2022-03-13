import { useEffect, useState } from 'react'
import MapView, { Circle, LatLng } from 'react-native-maps'
import * as Location from 'expo-location'
import uuid from 'react-native-uuid'
import { Alert, Text } from 'react-native'

import { Feather } from '@expo/vector-icons'
import { Container, FloatButton, OverView } from '../styles/Global'
import { NotificationArea, useCircles } from '../contexts/circles'
import { useNavigation } from '@react-navigation/core'

export default function Map() {
  const [granted, setGranted] = useState(false)
  const [location, setLocation] = useState<Location.LocationObject>()

  const { circles, setCircles } = useCircles()
  const navigation = useNavigation()

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

  function checkIfLocationIsInsideCircle() {}

  if (granted === false || !location) {
    return (
      <Container>
        <Text>Location permission needed!</Text>
      </Container>
    )
  }

  return (
    <Container>
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
      <OverView>
        <FloatButton onPress={() => navigation.navigate('Points' as never)}>
          <Feather name="list" size={28} color="white" />
        </FloatButton>
        <FloatButton
          style={{ backgroundColor: '#f22d0a' }}
          onPress={() => Alert.alert('Em construção')}
        >
          <Feather name="plus" size={28} color="white" />
        </FloatButton>
      </OverView>
    </Container>
  )
}
